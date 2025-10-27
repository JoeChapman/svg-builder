import Element, {
  ElementAttributes, ElementContent, 
} from './element';

class Text extends Element {
  constructor (attrs: ElementAttributes | undefined, content?: ElementContent) {
    super(attrs, content);
    this.name = 'text';
    
    this.permittedContent = [
      'animation',
      'descriptive',
      'textcontentchild',
      'container a',
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
export default Text;
