'use strict';

var Element = require('./element');

module.exports = Element.extend({

    constructor: function () {

        this.name = 'style';

        this.categories = 'none';

        this.permittedContent = 'any';

        this.permittedAttributes = [
            'type',
            'media',
            'title',
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