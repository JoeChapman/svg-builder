'use strict';

var Element = require('./element');

module.exports = Element.extend({

    constructor: function () {

        this.name = 'foreignObject';

        this.permittedContent = 'any';

        this.permittedAttributes = [
            'filterprimitive',
            'graphicalevent',
            'presentation',
            'core',
            'conditionalprocessing',
            [
                'style',
                'class',
                'externalResourcesRequired',
                'transform'
            ]
        ]

        Element.constructor.apply(this, arguments);
    }

});