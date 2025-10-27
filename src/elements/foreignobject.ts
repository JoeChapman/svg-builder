'use strict';

import Element, {
  ElementAttributes, ElementContent, 
} from './element';

class ForeignObject extends Element {
  constructor (attrs: ElementAttributes | undefined, content?: ElementContent) {
    super(attrs, content);

    this.name = 'foreignObject';
    this.permittedContent = 'any';
    this.permittedAttributes = [
      'filterprimitive',
      'graphicalevent',
      'presentation',
      'core',
      'conditionalprocessing',
      [
        'style',
        'class',
        'externalResourcesRequired',
        'transform',
      ],
    ];
    this.initializeNode();
  }
}

export default ForeignObject;
