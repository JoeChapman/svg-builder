import elementRegistry, {
  ELEMENT_NAMES,
  type ElementConstructor,
  type ElementName,
  type ElementAttributes,
  type ElementContent,
} from './elements/index.js';
import type ElementBase from './elements/element.js';
import type { BuilderLike } from './elements/element';

type NumericOrString = number | string;

type ElementBuilderMethods<T> = {
  [Name in ElementName]: (attrs?: ElementAttributes, content?: ElementContent) => T;
};

export interface SVGBuilderInstance extends BuilderLike, ElementBuilderMethods<SVGBuilderInstance> {
  root: string;
  elements: string[];
  closeTag(name: string): string;
  width(value: NumericOrString): SVGBuilderInstance;
  height(value: NumericOrString): SVGBuilderInstance;
  viewBox(value: string): SVGBuilderInstance;
  render(): string;
  buffer(): Uint8Array;
  reset(): SVGBuilderInstance;
  newInstance(): SVGBuilderInstance;
}

interface SVGBuilderInternal extends SVGBuilderInstance {
  addElement(element: ElementBase): void;
}

type SVGBuilderConstructor = {
  new (): SVGBuilderInternal;
  prototype: SVGBuilderInternal;
};

const formatRoot = (instance: SVGBuilderInternal, name: string, value: NumericOrString): string => {
  const regexp = new RegExp(name + '([^=,]*)=("[^"]*"|[^,"]*)');
  return instance.root.replace(regexp, name + '="' + value + '"');
};

type NodeBufferConstructor = {
  from(input: string): Uint8Array;
};

type GlobalScope = typeof globalThis | undefined;

const resolveNodeBuffer = (scope: GlobalScope = globalThis): NodeBufferConstructor | null => {
  if (!scope) {
    return null;
  }
  const maybeBuffer = (scope as { Buffer?: NodeBufferConstructor }).Buffer;
  return maybeBuffer && typeof maybeBuffer.from === 'function' ? maybeBuffer : null;
};

type TextEncoderConstructor = new () => TextEncoder;

const createEncoder = (scope: GlobalScope = globalThis): TextEncoder | null => {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder();
  }
  if (!scope) {
    return null;
  }
  const globalEncoder = (scope as { TextEncoder?: TextEncoderConstructor }).TextEncoder;
  if (globalEncoder) {
    return new globalEncoder();
  }
  return null;
};

const fallBackEncode = (value: string): Uint8Array => {
  const length = value.length;
  const result = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    result[i] = value.charCodeAt(i) & 0xff;
  }
  return result;
};

const nodeBuffer = resolveNodeBuffer();
const textEncoder = nodeBuffer ? null : createEncoder();

function SVGBuilder(this: SVGBuilderInternal) {
  this.root = '<svg height="100" width="100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
  this.elements = [];

  this.closeTag = (name: string): string => {
    return '</' + name + '>';
  };

  this.width = (value: NumericOrString): SVGBuilderInstance => {
    this.root = formatRoot(this, 'width', value);
    return this;
  };

  this.height = (value: NumericOrString): SVGBuilderInstance => {
    this.root = formatRoot(this, 'height', value);
    return this;
  };

  this.viewBox = (value: string): SVGBuilderInstance => {
    this.root = this.root.replace('<svg ', `<svg viewBox="${value}" `);
    return this;
  };

  this.addElement = (element: ElementBase) => {
    if (!element.content) {
      element.node += this.closeTag(element.name);
      this.elements.push(element.node);
    } else if (typeof element.content === 'string' && element.name === 'text') {
      element.node += element.content + this.closeTag(element.name);
      this.elements.push(element.node);
    } else if (typeof element.content === 'object') {
      const existingElements = this.elements.join('');
      this.elements = [];
      this.elements.unshift(element.node, existingElements);
      this.elements.push(this.closeTag(element.name));
    }
  };
}

const SVGBuilderCtor = SVGBuilder as unknown as SVGBuilderConstructor;

SVGBuilderCtor.prototype.newInstance = function newInstance(this: SVGBuilderInternal): SVGBuilderInstance {
  return new SVGBuilderCtor();
};

SVGBuilderCtor.prototype.reset = function reset(this: SVGBuilderInternal): SVGBuilderInstance {
  this.elements = [];
  return this;
};

SVGBuilderCtor.prototype.render = function render(this: SVGBuilderInternal): string {
  return this.root + this.elements.join('') + this.closeTag('svg');
};

SVGBuilderCtor.prototype.buffer = function buffer(this: SVGBuilderInternal): Uint8Array {
  const output = this.render();
  if (nodeBuffer) {
    return nodeBuffer.from(output);
  }
  if (textEncoder) {
    return textEncoder.encode(output);
  }
  return fallBackEncode(output);
};

ELEMENT_NAMES.forEach((name: ElementName) => {
  const ElementCtor: ElementConstructor = elementRegistry[name];
  SVGBuilderCtor.prototype[name] = function elementMethod(
    this: SVGBuilderInternal,
    attrs?: ElementAttributes,
    content?: ElementContent,
  ): SVGBuilderInstance {
    this.addElement(new ElementCtor(attrs, content));
    return this;
  };
});

const templateBuilder = new SVGBuilderCtor();
const defaultRoot = templateBuilder.root;
let currentBuilder: SVGBuilderInternal | null = null;

const create = (): SVGBuilderInstance => {
  currentBuilder = new SVGBuilderCtor();
  return currentBuilder;
};

const ensureBuilder = (): SVGBuilderInternal => {
  if (currentBuilder) {
    return currentBuilder;
  }
  currentBuilder = new SVGBuilderCtor();
  return currentBuilder;
};

const resetBuilder = (builder: SVGBuilderInternal) => {
  builder.reset();
  builder.root = defaultRoot;
};

const svgBuilder = {
  create,
  newInstance: (): SVGBuilderInstance => {
    const builder = ensureBuilder();
    resetBuilder(builder);
    return builder;
  },
};

export default svgBuilder;
