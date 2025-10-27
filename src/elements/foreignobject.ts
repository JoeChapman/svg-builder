'use strict';

import Element from './element';

class ForeignObject extends Element {
  constructor (attrs: object, content: any) {
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
  }
}

export default ForeignObject;
