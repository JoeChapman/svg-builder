'use strict';

var elements = require('./elements/');

function SvgBuilder() {

    this.root = '<svg height="100" width="100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
    this.elements = [];

    function formatRoot(name, value) {
      /* jshint -W040 */
        var formatted = this.root,
            regexp = new RegExp(name + '([^=,]*)=("[^"]*"|[^,"]*)');
        return formatted.replace(regexp, name + '="' + value + '"');
      /* jshint +W040 */
    }

    this.closeTag = function closeTag(name) {
        return '</' + name + '>';
    };

    this.width = function width(value) {
        this.root = formatRoot.call(this, 'width', value);
        return this;
    };

    this.height = function height(value) {
        this.root = formatRoot.call(this, 'height', value);
        return this;
    };

    this.viewBox = function viewBox(value) {
        this.root = this.root.replace("<svg ", `<svg viewBox="${value}" `);
        return this;
    }

    this.addElement = function addElement(element) {
        if (!element.content) {
            element.node += this.closeTag(element.name);
            this.elements.push(element.node);
        } else if (typeof element.content === 'string' && element.name === 'text') {
            element.node += element.content + this.closeTag(element.name);
            this.elements.push(element.node);
        } else if (typeof element.content === 'object') {
            var elements = this.elements.join('');
            this.elements = [];
            this.elements.unshift(element.node, elements);
            this.elements.push(this.closeTag(element.name));
        }
    };

}

SvgBuilder.prototype.newInstance = function() {
  return new SvgBuilder();
};

SvgBuilder.prototype.reset = function() {
  this.elements = [];
  return this;
};

SvgBuilder.prototype.render = function render() {
    return this.root + this.elements.join('') + this.closeTag('svg');
};

SvgBuilder.prototype.buffer = function toBuffer() {
    return Buffer.from(this.render());
}

SvgBuilder.prototype.a = function anchor(attrs, content) {
    this.addElement(new elements.A(attrs, content));
    return this;
};

SvgBuilder.prototype.g = function group(attrs, content) {
    this.addElement(new elements.G(attrs, content));
    return this;
};

SvgBuilder.prototype.circle = function circle(attrs, content) {
    this.addElement(new elements.Circle(attrs, content));
    return this;
};

SvgBuilder.prototype.text = function link(attrs, content) {
    this.addElement(new elements.Text(attrs, content));
    return this;
};

SvgBuilder.prototype.foreignObject = function foreignObject(attrs, content) {
    this.addElement(new elements.ForeignObject(attrs, content));
    return this;
};

SvgBuilder.prototype.line = function line(attrs, content) {
    this.addElement(new elements.Line(attrs, content));
    return this;
};

SvgBuilder.prototype.rect = function rect(attrs, content) {
    this.addElement(new elements.Rect(attrs, content));
    return this;
};

SvgBuilder.prototype.path = function line(attrs, content) {
    this.addElement(new elements.Path(attrs, content));
    return this;
};

SvgBuilder.prototype.style = function line(attrs, content) {
    this.addElement(new elements.Style(attrs, content));
    return this;
};

module.exports = new SvgBuilder();

