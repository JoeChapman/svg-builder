import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import svgBuilder, { type SVGBuilderInstance } from '../src/index';
import Element, {
  type BuilderLike,
  type ElementAttributes,
  type ElementContent,
} from '../src/elements/element';
import { ELEMENT_NAMES } from '../src/elements/index';

const DEFAULT_ROOT = '<svg height="100" width="100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';

class DemoElement extends Element {
  constructor(attrs?: ElementAttributes, content?: ElementContent) {
    super(attrs, content);
    this.name = 'demo-element';
    this.permittedContent = ['descriptive'];
    this.permittedAttributes = [
      'aria',
      [
        'class',
        'aria-label',
      ],
    ];
    this.initializeNode();
  }
}

describe('svg-builder core API', () => {
  let svg: SVGBuilderInstance;

  beforeEach(() => {
    svg = svgBuilder.create();
  });

  afterEach(() => {
    svgBuilder.newInstance();
  });

  it('creates a fresh builder instance with expected defaults', () => {
    expect(svg.root).toBe(DEFAULT_ROOT);
    expect(svg.elements).toEqual([]);
    expect(svg.closeTag('svg')).toBe('</svg>');
  });

  it('exposes chainable methods for every SVG2 element', () => {
    ELEMENT_NAMES.forEach((name) => {
      expect(svg).toHaveProperty(name);
      expect(typeof (svg as Record<string, unknown>)[name]).toBe('function');
    });
  });

  it('updates root attributes via width, height, and viewBox', () => {
    svg.width(200).height('300').viewBox('0 0 200 300');
    expect(svg.root).toContain('width="200"');
    expect(svg.root).toContain('height="300"');
    expect(svg.root.startsWith('<svg viewBox="0 0 200 300"')).toBe(true);
  });

  it('renders only the root and closing tag when empty', () => {
    expect(svg.render()).toBe(DEFAULT_ROOT + '</svg>');
  });

  it('rejects string content for non-text elements', () => {
    expect(() => svg.circle({ r: 5 }, 'bad-content')).toThrow('Content cannot be a string for circle elements.');
  });

  it('allows string content for text elements', () => {
    const markup = svg.text({ x: 10,
      y: 20 }, 'Hello').render();
    expect(markup).toContain('<text x="10" y="20">Hello</text>');
  });

  it('wraps existing children when passing builder-like content', () => {
    svg.circle({ r: 5 });
    const fakeBuilder = { elements: ['<ignored></ignored>'] } as BuilderLike;
    const output = svg.g({ id: 'wrapper' }, fakeBuilder).render();
    expect(output).toContain('<g id="wrapper"><circle r="5"></circle></g>');
  });

  it('resets accumulated elements via reset()', () => {
    svg.circle({ r: 5 });
    svg.reset();
    expect(svg.elements).toHaveLength(0);
    expect(svg.render()).toBe(DEFAULT_ROOT + '</svg>');
  });

  it('reuses the existing builder instance on newInstance()', () => {
    svg.width(250).circle({ r: 5 });
    const reused = svgBuilder.newInstance();
    expect(reused).toBe(svg);
    expect(reused.root).toBe(DEFAULT_ROOT);
    expect(reused.elements).toEqual([]);
  });

  it('creates an independent builder when calling newInstance() on an instance', () => {
    const clone = svg.newInstance();
    expect(clone).not.toBe(svg);
    clone.width(123);
    expect(clone.root).toContain('width="123"');
    expect(svg.root).not.toContain('width="123"');
  });
});

describe('Element base behaviour', () => {
  it('expands permitted content tokens and validates children', () => {
    const validContent = { elements: ['<title>ok</title>'] } as BuilderLike;
    const element = new DemoElement({ id: 'demo' }, validContent);
    expect(Array.isArray(element.permittedContent)).toBe(true);
    expect(element.permittedContent).toContain('title');
    const ariaLabelOccurrences = element.permittedAttributes.filter((attr) => attr === 'aria-label').length;
    expect(ariaLabelOccurrences).toBe(1);
    expect(element.node).toContain('id="demo"');
    expect(() => new DemoElement(undefined, { elements: ['<circle></circle>'] } as BuilderLike)).toThrow('demo-element cannot contain circle elements.');
  });

  it('omits undefined attributes when generating markup', () => {
    const element = new DemoElement({ class: 'box',
      hidden: undefined });
    expect(element.node).toContain('class="box"');
    expect(element.node).not.toContain('hidden="undefined"');
  });

  it('parses tag names from raw markup', () => {
    const element = new DemoElement();
    expect(element.getElementName('<foreignObject></foreignObject>')).toBe('foreignObject');
  });
});

describe('static lookup data', () => {
  it('exposes known ARIA attributes', async () => {
    const { default: attributes } = await import('../src/attributes/index.js');
    expect(attributes.aria).toContain('aria-label');
    expect(attributes.presentation).toContain('fill');
  });

  it('lists text content categories', async () => {
    const { default: content } = await import('../src/content/index.js');
    expect(content.textcontent).toContain('text');
    expect(content.structural).toContain('svg');
  });
});

describe('buffer() encoding strategies', () => {
  const originalBuffer = global.Buffer;
  const originalBufferFrom = originalBuffer?.from;
  const OriginalTextEncoder = global.TextEncoder;

  const importFreshSvgBuilder = async () => {
    const module = await import('../src/index.js');
    return module.default;
  };

  const restoreGlobals = () => {
    if (originalBuffer) {
      (global as typeof global & { Buffer?: typeof Buffer }).Buffer = originalBuffer;
      if (typeof originalBufferFrom === 'function') {
        (global.Buffer as typeof Buffer).from = originalBufferFrom;
      } else {
        delete (global.Buffer as unknown as { from?: unknown }).from;
      }
    } else {
      delete (global as typeof global & { Buffer?: typeof Buffer }).Buffer;
    }

    if (OriginalTextEncoder) {
      (global as typeof global & { TextEncoder?: typeof TextEncoder }).TextEncoder = OriginalTextEncoder;
    } else {
      delete (global as typeof global & { TextEncoder?: typeof TextEncoder }).TextEncoder;
    }
  };

  beforeEach(() => {
    restoreGlobals();
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    restoreGlobals();
  });

  it('prefers Node Buffer when available', async () => {
    const builderModule = await importFreshSvgBuilder();
    const buffer = builderModule.create().buffer();
    expect(buffer).toBeInstanceOf(Uint8Array);
    expect(Buffer.isBuffer(buffer)).toBe(true);
  });

  it('uses TextEncoder when Buffer lacks from()', async () => {
    if (!originalBuffer) {
      throw new Error('Buffer is not available in this environment.');
    }

    const encodeResult = new Uint8Array([1, 2, 3]);
    const encodeSpy = vi.fn((_arg: string) => encodeResult);

    const bufferGetter = vi.spyOn(globalThis, 'Buffer', 'get');

    const bufferStub = Object.assign(
      function BufferProxy(...args: unknown[]) {
        return Reflect.construct(
          originalBuffer as unknown as new (...ctorArgs: unknown[]) => unknown,
          args,
        );
      },
      {
        from: undefined as unknown as typeof Buffer.from,
        isBuffer: originalBuffer.isBuffer.bind(originalBuffer),
      },
    );

    Object.setPrototypeOf(bufferStub, originalBuffer);
    (bufferStub as { prototype: unknown }).prototype = originalBuffer.prototype;

    bufferGetter.mockImplementation(() => {
      const stack = new Error().stack ?? '';
      if (stack.includes('/src/index')) {
        return bufferStub as unknown as typeof Buffer;
      }
      return originalBuffer;
    });

    class FakeEncoder {
      encode(value: string): Uint8Array {
        return encodeSpy(value);
      }
    }

    vi.stubGlobal('TextEncoder', FakeEncoder as unknown as typeof TextEncoder);

    const builderModule = await importFreshSvgBuilder();
    bufferGetter.mockRestore();

    const builder = builderModule.create();
    const expectedMarkup = builder.render();
    const result = builder.buffer();

    expect(encodeSpy).toHaveBeenCalledTimes(1);
    expect(encodeSpy).toHaveBeenCalledWith(expectedMarkup);
    expect(result).toBe(encodeResult);
  });

  it('falls back to manual encoding when Buffer and TextEncoder are unavailable', async () => {
    if (!originalBuffer) {
      throw new Error('Buffer is not available in this environment.');
    }

    const bufferGetter = vi.spyOn(globalThis, 'Buffer', 'get');
    const bufferStub = Object.assign(
      function BufferProxy(...args: unknown[]) {
        return Reflect.construct(
          originalBuffer as unknown as new (...ctorArgs: unknown[]) => unknown,
          args,
        );
      },
      {
        from: undefined as unknown as typeof Buffer.from,
        isBuffer: originalBuffer.isBuffer.bind(originalBuffer),
      },
    );

    Object.setPrototypeOf(bufferStub, originalBuffer);
    (bufferStub as { prototype: unknown }).prototype = originalBuffer.prototype;

    bufferGetter.mockImplementation(() => {
      const stack = new Error().stack ?? '';
      if (stack.includes('/src/index')) {
        return bufferStub as unknown as typeof Buffer;
      }
      return originalBuffer;
    });

    vi.stubGlobal('TextEncoder', undefined as unknown as typeof TextEncoder);

    const builderModule = await importFreshSvgBuilder();
    bufferGetter.mockRestore();

    const builder = builderModule.create().viewBox('0 0 10 10');
    const markup = builder.render();
    const result = builder.buffer();
    const expected = new Uint8Array(markup.length);
    for (let i = 0; i < markup.length; i += 1) {
      expected[i] = markup.charCodeAt(i) & 0xff;
    }
    expect(result).toEqual(expected);
  });
});

describe('environment detection', () => {
  it('creates a builder when newInstance is the first call', async () => {
    vi.resetModules();
    const { default: builderModule } = await import('../src/index.js');
    const fresh = builderModule.newInstance();
    expect(fresh.render()).toContain('</svg>');
    const reused = builderModule.newInstance();
    expect(reused).toBe(fresh);
  });
});
