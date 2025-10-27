import Element, {
  ElementAttributes, ElementContent, 
} from './element';

class Circle extends Element {
  constructor (attrs: ElementAttributes | undefined, content?: ElementContent) {
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
    this.initializeNode();
  }
}

export default Circle;
