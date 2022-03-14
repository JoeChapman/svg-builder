'use strict';

var Element = require('./element');

module.exports = Element.extend({

    constructor: function () {

        this.name = 'g';

        this.permittedContent = 'any';

        this.permittedAttributes = [
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
        ];

        Element.constructor.apply(this, arguments);

    }

});