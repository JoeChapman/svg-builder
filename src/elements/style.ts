import Element from './element';

class Style extends Element {
  constructor (attrs: any, content: any) {
    super(attrs, content);
    
    this.name = 'style';
    this.permittedContent = 'any';
    this.permittedAttributes = [
      'type',
      'media',
      'title',
      [
        'style',
        'class',
        'externalResourcesRequired',
        'transform',
      ],
    ];
  }
}

export default Style;
