import Element, {
  ElementAttributes,
  ElementContent,
} from './element.js';
import {
  ELEMENT_NAMES,
  ATTRIBUTE_NAMES,
  ELEMENT_ATTRIBUTE_INDICES,
  type ElementName,
} from './definitions.js';

type ElementConstructor = new (attrs?: ElementAttributes, content?: ElementContent) => Element;
type ElementRegistry = Record<ElementName, ElementConstructor>;

const PRESENTATION_ONLY: readonly string[] = ['presentation'];
const attributeCache = new Map<ElementName, readonly string[]>();

const getAttributeTokens = (name: ElementName): readonly string[] => {
  const cached = attributeCache.get(name);
  if (cached) {
    return cached;
  }
  const indices = ELEMENT_ATTRIBUTE_INDICES[name];
  
  if (!indices || indices.length === 0) {
    attributeCache.set(name, PRESENTATION_ONLY);
    return PRESENTATION_ONLY;
  }
  const tokens: string[] = ['presentation'];
  indices.forEach((index) => {
    const attribute = ATTRIBUTE_NAMES[index];
    if (attribute) {
      tokens.push(attribute);
    }
  });

  if (tokens.length > 1) {
    const deduped = Array.from(new Set(tokens));
    attributeCache.set(name, deduped);
    return deduped;
  }
  attributeCache.set(name, PRESENTATION_ONLY);
  return PRESENTATION_ONLY;
};

const createElementConstructor = (name: ElementName): ElementConstructor => {
  return class GeneratedElement extends Element {
    constructor(attrs?: ElementAttributes, content?: ElementContent) {
      super(attrs, content);
      this.name = name;
      const attributeTokens = getAttributeTokens(name);
      this.permittedAttributes = Array.from(attributeTokens);
      this.permittedContent = 'any';
      this.initializeNode();
    }
  };
};

const registry = ELEMENT_NAMES.reduce<ElementRegistry>((accumulator, name) => {
  accumulator[name] = createElementConstructor(name);
  return accumulator;
}, {} as ElementRegistry);

export type {
  ElementConstructor,
  ElementName,
  ElementAttributes,
  ElementContent,
};

export {
  ELEMENT_NAMES,
  ATTRIBUTE_NAMES,
  ELEMENT_ATTRIBUTE_INDICES,
};

export default registry;
