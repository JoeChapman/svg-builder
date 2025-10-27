'use strict';

import Element from './element';

class A extends Element {

  name: string;
  permittedContent: string;
  permittedAttributes: (string | string[])[];

  constructor (attrs: object, content: any) {
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
  }
};

export default A;