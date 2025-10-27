'use strict';

import Element from './element';

class Line extends Element {
  constructor (attrs: any, content: any) {
    super(attrs, content);
    
    this.name = 'line';
    this.permittedContent = [
      'animation',
      'descriptive',
    ];
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

export default Line;
