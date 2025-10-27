import Element, {
  ElementAttributes, ElementContent, 
} from './element';

class Rect extends Element {
  constructor (attrs: ElementAttributes | undefined, content?: ElementContent) {
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
    this.initializeNode();
  } 
}

export default Rect;
