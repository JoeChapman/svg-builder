import {
  describe, it, expect, beforeEach, 
} from 'vitest';
import svgBuilder from '../src/index';

describe('svg-builder', () => {
  const svg = svgBuilder.create();

  describe('require("svg-builder")', () => {
    it('returns object with own width function', () => {
      expect(Object.prototype.hasOwnProperty.call(svg, 'width')).toBe(true);
      expect(svg.width).toBeTypeOf('function');
    });

    it('returns object with own height function', () => {
      expect(Object.prototype.hasOwnProperty.call(svg, 'height')).toBe(true);
      expect(svg.height).toBeTypeOf('function');
    });

    it('returns object with own viewBox function', () => {
      expect(Object.prototype.hasOwnProperty.call(svg, 'viewBox')).toBe(true);
      expect(svg.viewBox).toBeTypeOf('function');
    });

    it('returns object with prototypal render method', () => {
      expect(svg).toHaveProperty('render');
      expect(svg.render).toBeTypeOf('function');
    });

    it('returns object with prototypal circle method', () => {
      expect(svg).toHaveProperty('circle');
      expect(svg.circle).toBeTypeOf('function');
    });

    it('returns object with prototypal text method', () => {
      expect(svg).toHaveProperty('text');
      expect(svg.text).toBeTypeOf('function');
    });

    it('returns object with prototypal line method', () => {
      expect(svg).toHaveProperty('line');
      expect(svg.line).toBeTypeOf('function');
    });

    it('returns object with prototypal rect method', () => {
      expect(svg).toHaveProperty('rect');
      expect(svg.rect).toBeTypeOf('function');
    });

    it('returns object with prototypal path method', () => {
      expect(svg).toHaveProperty('path');
      expect(svg.path).toBeTypeOf('function');
    });

    it('returns always the same object', () => {
      svg.circle({ r: 40 }).circle({ r: 50 });
      const secondBuilder = svgBuilder.newInstance();
      expect(secondBuilder).toBe(svg);
      expect(secondBuilder.elements).toBe(svg.elements);
    });
  });

  describe('.width(200)', () => {
    beforeEach(() => {
      svg.width(200);
    });

    it('sets the root element width to 200', () => {
      expect(svg.root).toContain('width="200"');
    });

    it('does not set the root element with to 100', () => {
      expect(svg.root).not.toContain('width="100"');
    });
  });

  describe('.height(200)', () => {
    beforeEach(() => {
      svg.height(200);
    });

    it('sets the root element height to 200', () => {
      expect(svg.root).toContain('height="200"');
    });

    it('does not set the root element with to 100', () => {
      expect(svg.root).not.toContain('height="100"');
    });
  });

  describe('.viewBox', () => {
    it('should not have a viewBox propety by default', () => {
      expect(svg.root).not.toContain('viewBox=');
    });

    it('should set the viewBox property when called', () => {
      expect(svg.viewBox('0 0 100 100').render()).toContain('viewBox="0 0 100 100"');
    });
  });

  describe('.render() before calling an element method', () => {
    it('returns the root element with no content', () => {
      expect(svg.render()).toEqual(svg.root + svg.closeTag('svg'));
    });
  });

  describe('.a()', () => {
    describe('chaining', () => {
      it('returns the svg object', () => {
        expect(
          svg
            .a({ 'xlink:href': '/' })
            .a({ 'xlink:href': '/' })
            .a({ 'xlink:href': '/' })
            .a({ 'xlink:href': '/' }),
        ).toBe(svg);
      });

      describe('.render()', () => {
        it('returns the svg string with chained elements', () => {
          const result = svg
            .a({ 'xlink:href': '/' })
            .a({ 'xlink:href': '/about' })
            .render();

          expect(result).toEqual(svg.root + '<a xlink:href="/"></a><a xlink:href="/about"></a>' + svg.closeTag('svg'));
        });
      });
    });

    describe('content', () => {
      it('can contain other a elements', () => {
        expect(() => {
          svg.a(
            { 'xlink:href': '/' },
            svg.a({ 'xlink:href': '/about' }),
          ).render();
        }).not.toThrow('a cannot contain a elements.');
      });

      describe('.render()', () => {
        it('returns the complete svg string with a elements and content', () => {
          const result = svg.a(
            { 'xlink:href': '/' },
            svg.a({ 'xlink:href': '/about' }),
          ).render();

          expect(result).toEqual(svg.root + '<a xlink:href="/"><a xlink:href="/about"></a></a>' + svg.closeTag('svg'));
        });
      });
    });
  });

  describe('.g()', () => {
    describe('chaining', () => {
      it('returns the svg object', () => {
        expect(
          svg
            .g({ fill: 'white' })
            .g({ fill: 'white' })
            .g({ fill: 'white' })
            .g({ fill: 'white' }),
        ).toBe(svg);
      });

      describe('.render()', () => {
        it('returns the svg string with chained elements', () => {
          const result = svg
            .g({ fill: 'white' })
            .g({ fill: 'white' })
            .render();

          expect(result).toEqual(svg.root + '<g fill="white"></g><g fill="white"></g>' + svg.closeTag('svg'));
        });
      });
    });

    describe('content', () => {
      it('can contain other g elements', () => {
        expect(() => {
          svg.g(
            { stroke: 'red' },
            svg.g({ stroke: 'blue' }),
          ).render();
        }).not.toThrow('a cannot contain g elements.');
      });

      it('groups other elements', () => {
        const result = svg.g(
          {
            fill: 'white',
            stroke: 'green',
            r: '40',
          },
          svg.circle({ cy: 40 }).circle({ cy: 60 }).circle({ cy: 10 }),
        ).render();

        expect(result).toEqual(
          svg.root +
            '<g fill="white" stroke="green" r="40"><circle cy="40"></circle><circle cy="60"></circle><circle cy="10"></circle></g>' +
            svg.closeTag('svg'),
        );
      });

      describe('.render()', () => {
        it('returns the complete svg string with g elements and content', () => {
          const result = svg.g(
            { fill: 'white' },
            svg.g({ fill: 'blue' }),
          ).render();

          expect(result).toEqual(svg.root + '<g fill="white"><g fill="blue"></g></g>' + svg.closeTag('svg'));
        });
      });
    });
  });

  describe('.circle()', () => {
    describe('chaining', () => {
      it('returns the svg object', () => {
        expect(
          svg
            .circle({ r: 40 })
            .circle({ r: 40 })
            .circle({ r: 40 })
            .circle({ r: 40 }),
        ).toBe(svg);
      });

      describe('.render()', () => {
        it('returns the svg string with chained elements', () => {
          const result = svg
            .circle({ r: 40 })
            .circle({ r: 20 })
            .render();

          expect(result).toEqual(svg.root + '<circle r="40"></circle><circle r="20"></circle>' + svg.closeTag('svg'));
        });
      });
    });

    it('cannot contain other circle elements', () => {
      expect(() => {
        svg.circle(
          {
            r: 40,
            fill: 'none',
            'stroke-width': 1,
            stroke: '#CB3728',
            cx: 42,
            cy: 82,
          },
          svg.circle({
            r: 40,
            fill: 'none',
            'stroke-width': 1,
            stroke: '#CB3728',
            cx: 42,
            cy: 82,
          }),
        );
      }).toThrow('circle cannot contain circle elements.');
    });

    describe('.render()', () => {
      it('returns the svg string with circle element and attributes', () => {
        const result = svg.circle({
          r: 40,
          fill: 'none',
          'stroke-width': 1,
          stroke: '#CB3728',
          cx: 42,
          cy: 82,
        }).render();

        expect(result).toEqual(
          svg.root +
            '<circle r="40" fill="none" stroke-width="1" stroke="#CB3728" cx="42" cy="82"></circle>' +
            svg.closeTag('svg'),
        );
      });
    });
  });

  describe('.text()', () => {
    describe('chaining', () => {
      it('returns the svg object', () => {
        expect(
          svg
            .text({ r: 40 })
            .text({ r: 40 })
            .text({ r: 40 })
            .text({ r: 40 }),
        ).toBe(svg);
      });
    });

    it('cannot contain other text elements', () => {
      expect(() => {
        svg.text(
          {
            r: 40,
            fill: 'none',
            'stroke-width': 1,
            stroke: '#CB3728',
            cx: 42,
            cy: 82,
          },
          svg.text({
            r: 40,
            fill: 'none',
            'stroke-width': 1,
            stroke: '#CB3728',
            cx: 42,
            cy: 82,
          }),
        );
      }).toThrow('text cannot contain text elements.');
    });

    it('can contain a string', () => {
      const result = svg.text(
        {
          r: 40,
          fill: 'none',
          'stroke-width': 1,
          stroke: '#CB3728',
          cx: 42,
          cy: 82,
        },
        'Hello world',
      ).render();

      expect(result).toEqual(
        svg.root +
          '<text r="40" fill="none" stroke-width="1" stroke="#CB3728" cx="42" cy="82">Hello world</text>' +
          svg.closeTag('svg'),
      );
    });
  });

  describe('.line()', () => {
    describe('chaining', () => {
      it('returns the svg object', () => {
        expect(
          svg.line({
            x1: 0,
            y1: 0,
            x2: 40,
            y2: 40,
          }),
        ).toBe(svg);
      });

      describe('.render()', () => {
        it('returns the svg string with chained elements', () => {
          const result = svg
            .line({
              x1: 0,
              y1: 0,
              x2: 40,
              y2: 40,
            })
            .render();

          expect(result).toEqual(svg.root + '<line x1="0" y1="0" x2="40" y2="40"></line>' + svg.closeTag('svg'));
        });
      });

      describe('.buffer()', () => {
        let bufferSvg: typeof svg;

        beforeEach(() => {
          bufferSvg = svg.line({
            x1: 0,
            y1: 0,
            x2: 40,
            y2: 40,
          });
        });

        it('returns the svg as a buffer', () => {
          expect(bufferSvg.buffer()).toBeInstanceOf(Buffer);
        });

        it('should be identical to the svg .render() buffer', () => {
          expect(
            Buffer.compare(bufferSvg.buffer(), Buffer.from(bufferSvg.render())),
          ).toEqual(0);
        });
      });
    });

    it('cannot contain other line elements', () => {
      expect(() => {
        svg.line(
          {
            x1: 0,
            y1: 0,
            x2: 40,
            y2: 40,
          },
          svg.line({
            x1: 0,
            y1: 0,
            x2: 40,
            y2: 40,
          }),
        );
      }).toThrow('line cannot contain line elements.');
    });
  });

  describe('.rect()', () => {
    describe('chaining', () => {
      it('returns the svg object', () => {
        expect(
          svg.rect({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
          }),
        ).toBe(svg);
      });

      describe('.render()', () => {
        it('returns the svg string with chained elements', () => {
          const result = svg
            .rect({
              x: 0,
              y: 0,
              width: 40,
              height: 40,
            })
            .render();

          expect(result).toEqual(svg.root + '<rect x="0" y="0" width="40" height="40"></rect>' + svg.closeTag('svg'));
        });
      });
    });

    it('cannot contain other rect elements', () => {
      expect(() => {
        svg.rect(
          {
            x: 0,
            y: 0,
            width: 40,
            height: 40,
          },
          svg.rect({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
          }),
        );
      }).toThrow('rect cannot contain rect elements.');
    });
  });

  describe('.path()', () => {
    describe('chaining', () => {
      it('returns the svg object', () => {
        expect(
          svg.path({ d: 'M 100 100 L 300 100 L 200 300 z' }),
        ).toBe(svg);
      });

      describe('.render()', () => {
        it('returns the svg string with chained elements', () => {
          const result = svg
            .path({ d: 'M 100 100 L 300 100 L 200 300 z' })
            .render();

          expect(result).toEqual(
            svg.root + '<path d="M 100 100 L 300 100 L 200 300 z"></path>' + svg.closeTag('svg'),
          );
        });
      });
    });

    it('cannot contain other path elements', () => {
      expect(() => {
        svg.path(
          { d: 'M 100 100 L 300 100 L 200 300 z' },
          svg.path({ d: 'M 100 100 L 300 100 L 200 300 z' }),
        );
      }).toThrow('path cannot contain path elements.');
    });
  });

  describe('.style()', () => {
    describe('chaining', () => {
      it('returns the svg object', () => {
        expect(
          svg.style({
            d: 'M 100 100 L 300 100 L 200 300 z',
          }),
        ).toBe(svg);
      });

      describe('.render()', () => {
        it('returns the svg string with chained elements', () => {
          const result = svg.style({
            d: 'M 100 100 L 300 100 L 200 300 z',
          }).render();

          expect(result).toEqual(
            svg.root + '<style d="M 100 100 L 300 100 L 200 300 z"></style>' + svg.closeTag('svg'),
          );
        });
      });
    });
  });

  describe('.reset()', () => {
    it('empties the elements array', () => {
      svg
        .line({
          x1: 0,
          y1: 0,
          x2: 40,
          y2: 40,
        })
        .circle({ r: 5 });

      expect(svg.elements.length).toEqual(2);
      svg.reset();
      expect(svg.elements.length).toEqual(0);
    });

    it('should render only the root', () => {
      svg.circle({ r: 5 });
      svg.reset();
      expect(svg.render()).toEqual(svg.root + svg.closeTag('svg'));
    });
  });

  describe('new_Instance', () => {
    it('returns always a new builder', () => {
      svg.circle({ r: 5 }).circle({ r: 4 });
      const newBuilder = svg.newInstance();
      expect(newBuilder).not.toBe(svg);
      newBuilder.circle({ r: 5 }).circle({ r: 4 });
      expect(newBuilder.elements).not.toBe(svg.elements);
    });
  });
});
