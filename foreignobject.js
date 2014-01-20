'use strict';

var Element = require('./element');

module.exports = Element.extend({

    constructor: function () {

        this.name = 'foreignObject';

        this.permittedContent = 'any';

        this.permittedAttributes = {
            x                 : true,
            y                 : true,
            width             : true,
            height            : true,
            requiredExtensions: true
        };

        Element.constructor.apply(this, arguments);
    }

});