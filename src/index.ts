import * as elements from './elements/';
import type ElementBase from './elements/element';
import type {
  BuilderLike, ElementAttributes, ElementContent, 
} from './elements/element';

type NumericOrString = number | string;

export interface SVGBuilderInstance extends BuilderLike {
  root: string;
  elements: string[];
  closeTag(name: string): string;
  width(value: NumericOrString): SVGBuilderInstance;
  height(value: NumericOrString): SVGBuilderInstance;
  viewBox(value: string): SVGBuilderInstance;
  render(): string;
  buffer(): Buffer;
  reset(): SVGBuilderInstance;
  newInstance(): SVGBuilderInstance;
  a(attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance;
  g(attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance;
  circle(attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance;
  text(attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance;
  foreignObject(attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance;
  line(attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance;
  rect(attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance;
  path(attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance;
  style(attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance;
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

SVGBuilderCtor.prototype.buffer = function buffer(this: SVGBuilderInternal): Buffer {
  return Buffer.from(this.render());
};

SVGBuilderCtor.prototype.a = function anchor(this: SVGBuilderInternal, attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance {
  this.addElement(new elements.A(attrs, content));
  return this;
};

SVGBuilderCtor.prototype.g = function group(this: SVGBuilderInternal, attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance {
  this.addElement(new elements.G(attrs, content));
  return this;
};

SVGBuilderCtor.prototype.circle = function circle(this: SVGBuilderInternal, attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance {
  this.addElement(new elements.Circle(attrs, content));
  return this;
};

SVGBuilderCtor.prototype.text = function text(this: SVGBuilderInternal, attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance {
  this.addElement(new elements.Text(attrs, content));
  return this;
};

SVGBuilderCtor.prototype.foreignObject = function foreignObject(this: SVGBuilderInternal, attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance {
  this.addElement(new elements.ForeignObject(attrs, content));
  return this;
};

SVGBuilderCtor.prototype.line = function line(this: SVGBuilderInternal, attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance {
  this.addElement(new elements.Line(attrs, content));
  return this;
};

SVGBuilderCtor.prototype.rect = function rect(this: SVGBuilderInternal, attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance {
  this.addElement(new elements.Rect(attrs, content));
  return this;
};

SVGBuilderCtor.prototype.path = function path(this: SVGBuilderInternal, attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance {
  this.addElement(new elements.Path(attrs, content));
  return this;
};

SVGBuilderCtor.prototype.style = function style(this: SVGBuilderInternal, attrs?: ElementAttributes, content?: ElementContent): SVGBuilderInstance {
  this.addElement(new elements.Style(attrs, content));
  return this;
};

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
