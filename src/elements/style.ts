import Element, {
  ElementAttributes, ElementContent, 
} from './element';

class Style extends Element {
  constructor (attrs: ElementAttributes | undefined, content?: ElementContent) {
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
    this.initializeNode();
  }
}

export default Style;
