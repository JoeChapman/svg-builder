'use strict';

import Element, {
  ElementAttributes, ElementContent, 
} from './element';

class G extends Element {
  constructor (attrs: ElementAttributes | undefined, content?: ElementContent) {
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
    this.initializeNode();
  }
}

export default G;
