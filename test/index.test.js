'use strict';

var chai = require('chai');
chai.should();

describe('svg-builder', function () {

    var svg;

    beforeEach(function () {
        svg = require('../index');
    });

    afterEach(function () {
        svg.elements = [];
    })

    describe('require("svg-builder")', function () {

        it('returns object with own width function', function () {
            svg.should.have.ownProperty('width');
            svg.width.should.be.a('function');
        });

        it('returns object with own height function', function () {
            svg.should.have.ownProperty('height');
            svg.height.should.be.a('function');
        });

        it('returns object with prototypal render method', function () {
            svg.should.have.property('render');
            svg.render.should.be.a('function');
        });

        it('returns object with prototypal circle method', function () {
            svg.should.have.property('circle');
            svg.circle.should.be.a('function');
        });

        it('returns object with prototypal text method', function () {
            svg.should.have.property('text');
            svg.text.should.be.a('function');
        });

    });

    describe('.width(200)', function () {

        beforeEach(function () {
            svg.width(200);
        });

        it('sets the root element width to 200', function () {
            svg.root.should.include('width="200"')
        });

        it('does not set the root element with to 100', function () {
            svg.root.should.not.include('width="100"');
        });

    });

    describe('.height(200)', function () {

        beforeEach(function () {
            svg.height(200);
        });

        it('sets the root element height to 200', function () {
            svg.root.should.include('height="200"')
        });

        it('does not set the root element with to 100', function () {
            svg.root.should.not.include('height="100"');
        });

    });

    describe('.render() before calling an element method', function () {

        it('returns the root element with no content', function () {
            svg.render().should.equal(svg.root + svg.closeTag('svg'));
        });

    });

    describe('.circle()', function () {

        it('throws an error if no attributes', function () {
            (function () {
                svg.circle();
            }).should.Throw('An element must have attributes');
        });

        it('can be chained', function () {
            svg.circle({r: 40}).circle({r: 40}).circle({r: 40}).circle({r: 40}).should.equal(svg);
        });

        it('adds a circle element with attributes to the elements list', function () {

            svg.circle({
                r: 40,
                fill: 'none',
                'stroke-width': 1,
                stroke: '#CB3728',
                cx: 42,
                cy: 82,
            }).elements.should.include('<circle r="40" fill="none" stroke-width="1" stroke="#CB3728" cx="42" cy="82"></circle>');
        });

        it('adds a circle element with attributes to the elements list', function () {

            svg.circle({
                r: 40,
                fill: 'none',
                'stroke-width': 1,
                stroke: '#CB3728',
                cx: 42,
                cy: 82,
            }).elements.should.include('<circle r="40" fill="none" stroke-width="1" stroke="#CB3728" cx="42" cy="82"></circle>');
        });

        it('cannot have content', function () {

            (function () {
                svg.circle({
                    r: 40,
                    fill: 'none',
                    'stroke-width': 1,
                    stroke: '#CB3728',
                    cx: 42,
                    cy: 82,
                }, svg.circle({
                    r: 40,
                    fill: 'none',
                    'stroke-width': 1,
                    stroke: '#CB3728',
                    cx: 42,
                    cy: 82,
                }))
            }).should.throw('circle cannot contain circle elements.');

        });

        describe('.render() after .circle()', function () {

            it('returns the complete svg with circle element and attributes', function () {
                svg.circle({
                    r: 40,
                    fill: 'none',
                    'stroke-width': 1,
                    stroke: '#CB3728',
                    cx: 42,
                    cy: 82,
                }).render().should.equal(svg.root + '<circle r="40" fill="none" stroke-width="1" stroke="#CB3728" cx="42" cy="82"></circle>' + svg.closeTag('svg'));
            });

        });

    });

});






