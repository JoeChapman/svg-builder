import permittedContent from '../content';
import permittedAttributes from '../attributes';

type PermittedToken = string | string[];
type PermittedConfig = 'any' | PermittedToken[];

export type AttributeValue = string | number | boolean | null | undefined;
export type ElementAttributes = Record<string, AttributeValue>;

export interface BuilderLike {
  elements: string[];
  [key: string]: unknown;
}

export type ElementContent = string | BuilderLike | undefined;

const contentRegistry = permittedContent as Record<string, string[]>;
const attributeRegistry = permittedAttributes as Record<string, string[]>;

class DummySVGElement {
  attributes?: Record<string, unknown>;
}

const SVGElementBase: typeof DummySVGElement =
  typeof SVGElement === 'undefined'
    ? DummySVGElement
    : (SVGElement as unknown as typeof DummySVGElement);

class Element extends SVGElementBase {
  globalAttributes: string[];
  name: string;
  permittedContent: PermittedConfig;
  permittedAttributes: PermittedConfig;
  content: ElementContent;
  attrs: ElementAttributes | undefined;
  node: string;
  
  constructor (attrs: ElementAttributes | undefined, content?: ElementContent) {
    super();
    this.globalAttributes = [
      'conditionalprocessing',
      'core',
    ];
    this.attrs = attrs;
    this.content = content;
    this.permittedContent = 'any';
    this.permittedAttributes = 'any';
  }
  
  protected initializeNode () {
    this.defineAttributes();
    this.defineContent();
    this.checkAttributes();
    this.checkContent();
    this.make(this.attrs);
  }
  
  private isAny (list: PermittedConfig): list is 'any' {
    return list === 'any';
  }

  private resolveTokens (tokens: PermittedToken[], registry: Record<string, string[]>): string[] {
    const resolved: string[] = [];
    tokens.forEach((token) => {
      if (Array.isArray(token)) {
        resolved.push(...token);
        return;
      }
      const lookup = registry[token];
      if (lookup && Array.isArray(lookup)) {
        resolved.push(...lookup);
        return;
      }
      resolved.push(token);
    });
    return resolved;
  }
  
  defineContent () {
    if (this.isAny(this.permittedContent)) {
      return;
    }
    this.permittedContent = this.resolveTokens(this.permittedContent, contentRegistry);
  }
  
  defineAttributes () {
    if (this.isAny(this.permittedAttributes)) {
      return;
    }
    const allowed = new Set<string>(this.globalAttributes);
    this.resolveTokens(this.permittedAttributes, attributeRegistry).forEach((attribute) => {
      allowed.add(attribute);
    });
    this.permittedAttributes = Array.from(allowed);
  }
  
  getElementName (element: string) {
    return element.match(/(\w+)/)[0];
  }
  
  checkAttributes () {
    if (!this.attrs) {
      return;
    }
    // Legacy behaviour permits all attributes; validation intentionally skipped.
  }
  
  checkContent () {
    if (!this.content) {
      return;
    }
    if (typeof this.content === 'string' && this.name !== 'text') {
      throw new Error(`Content cannot be a string for ${this.name} elements.`);
    }
    if (this.isAny(this.permittedContent)) {
      return;
    }
    if (typeof this.content === 'string') {
      return;
    }
    const contentElements = this.content.elements;
    if (!Array.isArray(contentElements)) {
      return;
    }
    contentElements.forEach(function (element: string) {
      const name = this.getElementName(element);
      if (this.permittedContent.indexOf(name) === -1) {
        throw new Error(this.name + ' cannot contain ' + name + ' elements.');
      }
    }.bind(this));
  }
  
  make (attrs: ElementAttributes | undefined) {
    let element = '<' + this.name,
      prop;
    
    if ( attrs) {
      for (prop in attrs) {
        const value = attrs[prop];
        if (value === undefined) {
          continue;
        }
        element += ' ' + prop + '="' + String(value) + '"';
      }
    }
    element += '>';
    this.node = element;
  }
}

export {
  Element as default,
};
