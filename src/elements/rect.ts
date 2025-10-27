import Element from './element';

class Rect extends Element {
  constructor (attrs: any, content: any) {
    super(attrs, content);

    this.name = 'rect';
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

export default Rect;
