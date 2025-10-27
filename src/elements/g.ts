'use strict';

import Element from './element';

class G extends Element {
  constructor (attrs: any, content: any) {
    super(attrs, content);

    this.name = 'g';
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
  }
}

export default G;
