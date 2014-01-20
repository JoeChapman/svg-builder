'use strict';

var Element = require('./element');

module.exports = Element.extend({

    constructor: function () {

        this.name = 'circle';

        this.permittedContent = [
            'animation',
            'descriptive'
        ];

        this.permittedAttributes = [
            'graphicalevent',
            'presentation'
        ];

        Element.constructor.apply(this, arguments);

    }

});