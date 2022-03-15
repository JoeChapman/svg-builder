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
    });

    describe('require("svg-builder")', function () {

        it('returns object with own width function', function () {
            svg.should.have.ownProperty('width');
            svg.width.should.be.a('function');
        });

        it('returns object with own height function', function () {
            svg.should.have.ownProperty('height');
            svg.height.should.be.a('function');
        });

        it('returns object with own viewBox function', function () {
            svg.should.have.ownProperty('viewBox');
            svg.viewBox.should.be.a('function');
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

        it('returns object with prototypal line method', function () {
            svg.should.have.property('line');
            svg.line.should.be.a('function');
        });

        it('returns object with prototypal rect method', function () {
            svg.should.have.property('rect');
            svg.rect.should.be.a('function');
        });

        it('returns object with prototypal path method', function () {
            svg.should.have.property('path');
            svg.path.should.be.a('function');
        });

        it('returns always the same object', function () {
          svg.circle({r:40}).circle({r: 50});
          var secondBuilder = require('../index');
          secondBuilder.should.equal(svg);
          secondBuilder.elements.should.equal(svg.elements);
        });
    });

    describe('.width(200)', function () {

        beforeEach(function () {
            svg.width(200);
        });

        it('sets the root element width to 200', function () {
            svg.root.should.include('width="200"');
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
            svg.root.should.include('height="200"');
        });

        it('does not set the root element with to 100', function () {
            svg.root.should.not.include('height="100"');
        });

    });

    describe('.viewBox', function () {
        it('should not have a viewBox propety by default', function () {
            svg.root.should.not.include('viewBox=')
        })

        it('should set the viewBox property when called', function () {
            svg.viewBox("0 0 100 100").render().should.include('viewBox="0 0 100 100"');
        })
    })

    describe('.render() before calling an element method', function () {

        it('returns the root element with no content', function () {
            svg.render().should.equal(svg.root + svg.closeTag('svg'));
        });

    });

    describe('.a()', function () {

        describe('chaining', function () {

            it('returns the svg object', function () {
                svg.a({'xlink:href': '/'}).a({'xlink:href': '/'}).a({'xlink:href': '/'}).a({'xlink:href': '/'}).should.equal(svg);
            });

            describe('.render()', function () {

                it('returns the svg string with chained elements', function () {
                    svg.a({
                        'xlink:href': '/'
                    }).a({
                        'xlink:href': '/about'
                    }).render().should.equal(svg.root + '<a xlink:href=\"/\"></a><a xlink:href=\"/about\"></a>' + svg.closeTag('svg'));
                });

            });
        });

        describe('content', function () {

            it('can contain other a elements', function () {

                (function () {
                    svg.a({
                        'xlink:href': '/'
                    }, svg.a({
                        'xlink:href': '/about'
                    })).render();
                }).should.not.throw('a cannot contain a elements.');

            });

            describe('.render()', function () {

                it('returns the complete svg string with a elements and content', function () {
                    svg.a({
                        'xlink:href': '/'
                    }, svg.a({
                        'xlink:href': '/about'
                    })).render().should.equal(svg.root + '<a xlink:href=\"/\"><a xlink:href=\"/about\"></a></a>' + svg.closeTag('svg'));
                });

            });

        });

    });

    describe('.g()', function () {

        describe('chaining', function () {
            it('returns the svg object', function () {
                svg
                .g({ fill: 'white' })
                .g({ fill: 'white' })
                .g({ fill: 'white' })
                .g({ fill: 'white' })
                    .should.equal(svg);
            });

            describe('.render()', function () {
                it('returns the svg string with chained elements', function () {
                    svg
                        .g({ fill: 'white' })
                        .g({ fill: 'white' })
                        .render()
                        .should.equal(svg.root + '<g fill="white"></g><g fill="white"></g>' + svg.closeTag('svg'));
                });
            });
        });

        describe('content', function () {

            it('can contain other g elements', function () {

                (function () {
                    svg.g({
                        'stroke': 'red'
                    }, svg.g({
                        'stroke': 'blue'
                    })).render();
                }).should.not.throw('a cannot contain g elements.');

            });

            it('groups other elements', function () {
                svg.g({
                    'fill': 'white',
                    'stroke': 'green',
                    'r': '40'
                }, svg
                    .circle({cy: 40})
                    .circle({cy: 60})
                    .circle({cy: 10})
                )   
                .render()
                .should
                .equal(svg.root + '<g fill="white" stroke="green" r="40"><circle cy="40"></circle><circle cy="60"></circle><circle cy="10"></circle></g>' + svg.closeTag('svg'));

            });

            describe('.render()', function () {

                it('returns the complete svg string with g elements and content', function () {
                    svg.g({
                        'fill': 'white'
                    }, svg.g({
                        'fill': 'blue'
                    })).render().should.equal(svg.root + '<g fill="white"><g fill="blue"></g></g>' + svg.closeTag('svg'));
                });

            });

        });

    });

    describe('.circle()', function () {

        describe('chaining', function () {

            it('returns the svg object', function () {
                svg.circle({r: 40}).circle({r: 40}).circle({r: 40}).circle({r: 40}).should.equal(svg);
            });

            describe('.render()', function () {

                it('returns the svg string with chained elements', function () {
                    svg.circle({
                        r: 40
                    }).circle({
                        r: 20
                    }).render().should.equal(svg.root + '<circle r="40"></circle><circle r="20"></circle>' + svg.closeTag('svg'));
                });

            });

        });

        it('cannot contain other circle elements', function () {

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
                }));
            }).should.throw('circle cannot contain circle elements.');

        });

        describe('.render()', function () {

            it('returns the svg string with circle element and attributes', function () {
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

    describe('.text()', function () {

        describe('chaining', function () {

            it('returns the svg object', function () {
                svg.text({r: 40}).text({r: 40}).text({r: 40}).text({r: 40}).should.equal(svg);
            });

            describe('.render()', function () {

            });

        });

        it('cannot contain other text elements', function () {

            (function () {
                svg.text({
                    r: 40,
                    fill: 'none',
                    'stroke-width': 1,
                    stroke: '#CB3728',
                    cx: 42,
                    cy: 82,
                }, svg.text({
                    r: 40,
                    fill: 'none',
                    'stroke-width': 1,
                    stroke: '#CB3728',
                    cx: 42,
                    cy: 82,
                }));
            }).should.throw('text cannot contain text elements.');

        });

        it('can contain a string', function () {

            svg.text({
                r: 40,
                fill: 'none',
                'stroke-width': 1,
                stroke: '#CB3728',
                cx: 42,
                cy: 82,
            }, 'Hello world')
            .render().should.equal(svg.root + '<text r="40" fill="none" stroke-width="1" stroke="#CB3728" cx="42" cy="82">Hello world</text>' + svg.closeTag('svg'));

        });

    });
    describe('.line()', function () {

        describe('chaining', function () {

            it('returns the svg object', function () {
                svg.line({x1: 0, y1:0, x2: 40, y2:40}).should.equal(svg);
            });

            describe('.render()', function () {

                it('returns the svg string with chained elements', function () {
                    svg.line({
                        x1: 0,
                        y1:0,
                        x2: 40,
                        y2:40})
                    .render().should.equal(svg.root + '<line x1="0" y1="0" x2="40" y2="40"></line>' + svg.closeTag('svg'));
                });

            });

            describe(".buffer()", function () {
                let bufferSvg;

                beforeEach(function () {
                    bufferSvg = svg.line({
                        x1: 0,
                        y1:0,
                        x2: 40,
                        y2:40
                    })
                })

                it('returns the svg as a buffer', function () {
                    bufferSvg.buffer().should.be.instanceof(Buffer)
                })

                it('should be identical to the svg .render() buffer', function () {
                    Buffer.compare(
                        bufferSvg.buffer(),
                        Buffer.from(bufferSvg.render())
                    ).should.equal(0);
                })
            })

        });

        it('cannot contain other line elements', function () {
            (function() {
                svg.line({x1: 0,y1:0,x2: 40,y2:40},
                         svg.line({x1: 0,y1:0,x2: 40,y2:40}));
            }).should.throw('line cannot contain line elements.');

        });
    });


    describe('.rect()', function () {

        describe('chaining', function () {

            it('returns the svg object', function () {
                svg.rect({x: 0, y: 0, width: 40, height:40}).should.equal(svg);
            });

            describe('.render()', function () {

                it('returns the svg string with chained elements', function () {
                    svg.rect({
                        x: 0,
                        y:0,
                        width: 40,
                        height:40})
                    .render().should.equal(svg.root + '<rect x="0" y="0" width="40" height="40"></rect>' + svg.closeTag('svg'));
                });

            });

        });

        it('cannot contain other rect elements', function () {
            (function() {
                svg.rect({x: 0, y: 0, width: 40, height:40},
                         svg.rect({x: 0, y: 0, width: 40, height:40}));
            }).should.throw('rect cannot contain rect elements.');

        });
    });


    describe('.path()', function () {

        describe('chaining', function () {

            it('returns the svg object', function () {
                svg.path({d:'M 100 100 L 300 100 L 200 300 z'}).should.equal(svg);
            });

            describe('.render()', function () {

                it('returns the svg string with chained elements', function () {
                    svg.path({d:'M 100 100 L 300 100 L 200 300 z'})
                    .render().should.equal(svg.root + '<path d="M 100 100 L 300 100 L 200 300 z"></path>' + svg.closeTag('svg'));
                });

            });

        });

        it('cannot contain other path elements', function () {
            (function() {
                svg.path({d:'M 100 100 L 300 100 L 200 300 z'},
                         svg.path({d:'M 100 100 L 300 100 L 200 300 z'}));
            }).should.throw('path cannot contain path elements.');

        });
    });

    describe('.style()', function () {

        describe('chaining', function () {

            it('returns the svg object', function () {
                svg.style({
                    d:'M 100 100 L 300 100 L 200 300 z'
                }).should.equal(svg);
            });

            describe('.render()', function () {

                it('returns the svg string with chained elements', function () {
                    svg.style({
                        d: 'M 100 100 L 300 100 L 200 300 z'
                    })
                    .render()
                    .should
                    .equal(svg.root + '<style d="M 100 100 L 300 100 L 200 300 z"></style>' + svg.closeTag('svg'));
                });
            });
        });
    });

    describe('.reset()', function () {
        it('empties the elements array', function () {
            svg.line({x1: 0, y1:0, x2: 40, y2:40}).circle({r:5});
            svg.elements.length.should.equal(2);
            svg.reset();
            svg.elements.length.should.equal(0);
        });
        it('should render only the root', function () {
            svg.circle({r:5});
            svg.reset();
            svg.render().should.equal(svg.root + svg.closeTag('svg'));
        });
    });

    describe('new_Instance', function () {
        it('returns always a new builder', function() {
            svg.circle({r:5}).circle({r:4});
            var newBuilder = svg.newInstance();
            newBuilder.should.not.equal(svg);
            newBuilder.circle({r:5}).circle({r:4});
            newBuilder.elements.should.not.equal(svg.elements);
        });
    });

});


