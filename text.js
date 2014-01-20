'use strict';

var Element = require('./element');

module.exports = Element.extend({

    constructor: function () {

        this.name = 'text';

        this.permittedContent = [
            'animation',
            'descriptive',
            'textcontentchild'
        ];

        this.permittedAttributes = [
            'graphicalevent',
            'presentation'
        ];

        Element.constructor.apply(this, arguments);
    }

});