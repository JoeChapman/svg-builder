import permittedContent from '../content';
import permittedAttributes from '../attributes';


class Element extends SVGElement {
  globalAttributes: string[];
  name: string;
  permittedContent: string | (string | string[])[];
  permittedAttributes: string | (string | string[])[];
  content: any;
  attrs: any;
  node: string;
  
  constructor (attrs: any, content: any) {
    super();
    this.globalAttributes = [
      'conditionalprocessing',
      'core'
    ];
    this.attrs = attrs;
    this.content = content;
    this.defineAttributes();
    this.defineContent();
    this.checkAttributes();
    this.checkContent();
    this.make(attrs);
  }
  
  checkAny (list: string | (string | string[])[]): boolean {
    return (list === 'any');
  }
  
  defineContent () {
    if (this.checkAny(this.permittedContent)) {
      return;
    }
    this.permittedContent.forEach(function (item: string) {
      this.permittedContent = this.permittedContent.concat(permittedContent[item]);
    }, this);
  }
  
  defineAttributes () {
    if (this.checkAny(this.permittedAttributes)) {
      return;
    }
    const args = this.permittedAttributes.concat(this.globalAttributes);
    args.forEach(function (item) {
      this.permittedAttributes = args.concat(permittedAttributes[item]);
    }, this);
  }
  
  getElementName (element) {
    return element.match(/(\w+)/)[0];
  }
  
  checkAttributes () {
    for (const attr in this.attributes) {
      if (this.permittedAttributes.indexOf(attr) !== -1) {
        throw new Error(attr + ' is not permitted on ' + this.name + ' elements.');
      }
    }
  }
  
  checkContent () {
    if (this.content) {
      if (typeof this.content === 'string' && this.name !== 'text') {
        throw new Error('Content cannot be a string.');
      } else if (this.content.elements && this.permittedContent !== 'any') {
        this.content.elements.forEach(function (element) {
          const name = this.getElementName(element);
          if (this.permittedContent.indexOf(name) === -1) {
            throw new Error(this.name + ' cannot contain ' + name + ' elements.');
          }
        }.bind(this));
      }
    }
  }
  
  make (attrs: any) {
    let element = '<' + this.name,
      prop;
    
    if ( attrs) {
      for (prop in attrs) {
        element += (' ' + prop + '="' + attrs[prop]) + '"';
      }
    }
    element += '>';
    this.node = element;
  }
}

// function extendProps(onto, from) {
//     var props = Object.getOwnPropertyNames(from),
//         replace,
//         i;
//     for (i = 0; i < props.length; ++i) {
//         replace = getPropDesc(onto, props[i]);
//         if (!(props[i] in Function) && (!replace || replace.writable)) {
//             prop(onto, props[i], getPropDesc(from, props[i]));
//         }
//     }
// }

// function extend(parent, protoProps, staticProps) {
//     var child;

//     if (protoProps && protoProps.hasOwnProperty('constructor')) {
//         child = protoProps.constructor;
//     } else {
//         child = function subClass() {
//             return child.super.apply(this, arguments);
//         };
//     }

//     prop(child, 'super', { value: parent });

//     extendProps(child, parent);
//     if (staticProps) {
//         extendProps(child, staticProps);
//     }

//     child.prototype = Object.create(parent, {
//         constructor: {
//             value: child,
//             enumerable: false,
//             writable: true,
//             configurable: true
//         }
//     });

//     if (protoProps) {
//         extendProps(child.prototype, protoProps);
//     }
//     return child;
// }

// prop(Element, 'extend', {
//     configurable: true,
//     writable: true,
//     value (protoProps, staticProps) {
//         return extend(this, protoProps, staticProps);
//     }
// });

export {
  Element as default,
};
