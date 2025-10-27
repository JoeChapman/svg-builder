import Element from './element';

class Path extends Element {
  constructor (attrs: any, content: any) {
    super(attrs, content);
    
    this.name = 'path';
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

export default Path;
