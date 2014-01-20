'use strict';

var Element = require('./element');

module.exports = Element.extend({

    constructor: function () {

        this.name = 'a';

        this.permittedContent = 'any';

        this.permittedAttributes = [
            'graphicalevent',
            'presentation'
        ];

        Element.constructor.apply(this, arguments);

    }

});