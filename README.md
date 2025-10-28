svg-builder
===========

Simple, chainable SVG-building tool for NodeJS and the browser

[![CI](https://github.com/JoeChapman/svg-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/JoeChapman/svg-builder/actions/workflows/ci.yml)
[![NPM version](https://badge.fury.io/js/svg-builder.svg)](http://badge.fury.io/js/svg-builder)

### Install
```
npm install svg-builder
```

### Importing in your app

svg-builder ships precompiled CommonJS and ES Module bundles, so you can drop it into any build without extra tooling.

```ts
// ESM / modern bundlers
import svgBuilder from 'svg-builder';

const markup = svgBuilder.create().viewBox('0 0 100 100').render();
```

```ts
// CommonJS (e.g. older Node services)
const svgBuilder = require('svg-builder');

const markup = svgBuilder.create().viewBox('0 0 100 100').render();
```

### Test

```
$ npm test
```

### Usage (TypeScript)

```ts
import svgBuilder, { SVGBuilderInstance } from 'svg-builder';

const svg: SVGBuilderInstance = svgBuilder
  .create()
  .width(200)
  .height(200)
  .viewBox('0 0 200 200');

const rotatingCircle: string = svg.circle(
  {
    cx: 100,
    cy: 100,
    r: 80,
    fill: '#0EA5E9',
    'stroke-width': 8,
    stroke: '#1D4ED8',
    'aria-label': 'Animated disk',
  },
  svg.animateTransform({
    attributeName: 'transform',
    type: 'rotate',
    from: '0 100 100',
    to: '360 100 100',
    dur: '6s',
    repeatCount: 'indefinite',
  }),
).render();

console.log(rotatingCircle);
```

Chaining builder methods lets you configure filters, gradients, and other SVG 2 elements the same way:

```ts
import svgBuilder, { SVGBuilderInstance } from 'svg-builder';

const glow: SVGBuilderInstance = svgBuilder
  .create()
  .width(240)
  .height(160)
  .viewBox('0 0 240 160');

const softGlowExample: string = glow
  .defs(
    undefined,
    glow.filter(
      {
        id: 'softGlow',
        'color-interpolation-filters': 'sRGB',
      },
      glow.feGaussianBlur({
        stdDeviation: 6,
        in: 'SourceGraphic',
      }),
    ),
  )
  .rect({
    width: 240,
    height: 160,
    rx: 32,
    fill: '#0EA5E9',
    filter: 'url(#softGlow)',
  })
  .text(
    {
      x: 120,
      y: 96,
      fill: '#FFFFFF',
      'font-family': 'Inter, system-ui, sans-serif',
      'font-size': 24,
      'font-weight': 600,
      'text-anchor': 'middle',
    },
    'SVG 2',
  )
  .render();

console.log(softGlowExample);
```

Every method returns the same `SVGBuilderInstance`, so you can continue chaining or branch off by calling `svgBuilder.create()` again when you need a fresh document.
Pass `undefined` as the first argument when you only need to supply nested content, such as when building up filters or gradients.

### SVG Buffer
When you need binary output, call `svg.buffer()`. In Node.js it returns a `Buffer` (which extends `Uint8Array`), while in browsers it produces a `Uint8Array` without pulling in any polyfills. The helper intentionally probes the environment so your code does not need to juggle runtime checks: it prefers `Buffer.from` when available, falls back to `TextEncoder` in browsers, and finally uses a small manual encoder if neither API exists. This makes it safe to hand the result straight to file writers, HTTP clients, or any API that expects a `Uint8Array`, no matter where your bundle runs.

### Updating Element Definitions
The list of supported elements and their permitted attributes is generated from the SVG 2 specification. To refresh the dataset:
1. Download the latest copies of the SVG 2 element and attribute indexes:
   - [Element index (eltindex.html)](https://www.w3.org/TR/SVG2/eltindex.html)
   - [Attribute index (attindex.html)](https://www.w3.org/TR/SVG2/attindex.html)
2. Replace `spec_data/eltindex.html` and `spec_data/attindex.html` with the downloaded files.
3. Run the generator:

```
npm run generate:defs
```

This command regenerates both `src/elements/definitions.ts` and `spec_data/element-attributes.json`, ensuring the runtime and the dataset stay in sync. The `npm run build` script calls `generate:defs` automatically, so published bundles always ship with the latest definitions.

### SVG Elements
svg-builder now exposes a chainable method for every element defined in the [SVG 2 element index](https://w3c.github.io/svgwg/svg2-draft/eltindex.html) (63 elements, including filter primitives and animation elements). Each builder method mirrors the lowercase element name (`svg.feBlend()`, `svg.animateTransform()`, `svg.clipPath()`, etc.) and accepts an attributes object plus optional content.

### Contributing / Testing

- Run `npm test` (or `npx vitest run`) to execute the suite.
- Coverage checks are enabled by default; use `npx vitest run --coverage` if you want the detailed report.
- Before sending a PR that touches the spec data, run `npm run generate:defs` to refresh the derived files.
