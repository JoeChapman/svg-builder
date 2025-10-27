import Element from './element';

class Circle extends Element {
  constructor (attrs: any, content: any) {
    super(attrs, content);

    this.name = 'circle';
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

export default Circle;
