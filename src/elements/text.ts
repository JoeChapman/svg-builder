import Element from './element';

class Text extends Element {
  constructor (attrs: any, content: any) {
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
  }
}
export default Text;
