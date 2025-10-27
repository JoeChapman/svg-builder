'use strict';

import Element, {
  ElementAttributes, ElementContent, 
} from './element';

class A extends Element {
  constructor (attrs: ElementAttributes | undefined, content?: ElementContent) {
    super(attrs, content);
    this.name = 'a';
    this.permittedContent = 'any';
    this.permittedAttributes = [
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

export default A;
