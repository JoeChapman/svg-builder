'use strict';

var Element = require('./element');

module.exports = Element.extend({

    constructor: function () {

        this.name = 'text';

        this.permittedContent = [
            'animation',
            'descriptive',
            'textcontentchild',
            'container a'
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
                'transform'
            ]
        ];

        Element.constructor.apply(this, arguments);
    }

});