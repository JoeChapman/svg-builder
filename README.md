<p align="center">
  <img src="docs/logo.svg" alt="svg-builder wordmark" width="360"/>
</p>

Simple, chainable SVG-building tool for Node.js and the browser.

[![CI](https://github.com/JoeChapman/svg-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/JoeChapman/svg-builder/actions/workflows/ci.yml)
[![NPM version](https://badge.fury.io/js/svg-builder.svg)](https://badge.fury.io/js/svg-builder)

## Install

Requirements:

- Node.js 16 or newer to consume the published package.
- Node.js 22 or newer to run the local build/test tooling.

```
npm install svg-builder
```

## Importing in your app

svg-builder ships precompiled CommonJS and ES Module bundles, so you can drop it into any build without extra tooling.

```ts
// ESM / modern bundlers
import svgBuilder from 'svg-builder';
const markup = svgBuilder.create().viewBox('0 0 100 100').render();
```

```ts
// CommonJS (older Node services)
const svgBuilder = require('svg-builder');
const markup = svgBuilder.create().viewBox('0 0 100 100').render();
```

## Test

```
npm test
```

## Usage (TypeScript)

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
```

Chaining builder methods lets you configure filters, gradients, and other SVG 2 elements the same way:

```ts
const glow = svgBuilder
  .create()
  .width(240)
  .height(160)
  .viewBox('0 0 240 160');

const softGlowExample = glow
  .defs(
    undefined,
    glow.filter(
      { id: 'softGlow', 'color-interpolation-filters': 'sRGB' },
      glow.feGaussianBlur({ stdDeviation: 6, in: 'SourceGraphic' }),
    ),
  )
  .rect({ width: 240, height: 160, rx: 32, fill: '#0EA5E9', filter: 'url(#softGlow)' })
  .text({
    x: 120,
    y: 96,
    fill: '#FFFFFF',
    'font-family': 'Inter, system-ui, sans-serif',
    'font-size': 24,
    'font-weight': 600,
    'text-anchor': 'middle',
  }, 'SVG 2')
  .render();
```

### Grouping multiple children

When you want to nest multiple elements inside a parent (e.g. a `<g>`), build the children with a separate builder and pass that builder as the content argument. Each call produces a sibling, not a wrapper.

```ts
const circles = svgBuilder.create().circle({ cx: 40, cy: 40, r: 25 }).circle({ cx: 60, cy: 60, r: 25 });
const rectangles = svgBuilder.create().rect({ x: 20, y: 20, width: 40, height: 10 });

const nested = svgBuilder
  .create()
  .viewBox('0 0 100 100')
  .g({ id: 'first-group', fill: 'white', stroke: 'green' }, circles)
  .g({ id: 'second-group', fill: 'orange' }, rectangles)
  .render();
```

### Inline `<style>`, `<title>`, and `<desc>` nodes

Some SVG elements accept raw text content. Pass a string to write inline CSS or metadata directly (the README wordmark is generated this way).

```ts
const metadata = svgBuilder
  .create()
  .style({}, 'circle { fill: orange; }')
  .title({}, 'Chart Title')
  .desc({}, 'Accessible description for screen readers')
  .render();
```

### Generating the README logo (gradient version)

```bash
npm run build
mkdir -p docs
node <<'NODE' > docs/logo.svg
const svgBuilder = require('./dist/cjs/index.cjs');

const defs = svgBuilder
  .create()
  .linearGradient(
    { id: 'grad-base', x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
    svgBuilder.create().stop({ offset: '0%', 'stop-color': '#60a5fa' }).stop({ offset: '100%', 'stop-color': '#5779d7ff' }),
  )
  .linearGradient(
    { id: 'grad-accent', x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
    svgBuilder.create().stop({ offset: '0%', 'stop-color': '#d3c9a4ff' }).stop({ offset: '100%', 'stop-color': '#e8d14cff' }),
  );

const logo = svgBuilder
  .create()
  .width(360)
  .height(120)
  .viewBox('0 0 360 120')
  .style({}, `
    .wordmark { font: 900 64px 'Inter', 'Segoe UI', sans-serif; }
    .wordmark--base { fill: url(#grad-base); }
    .wordmark--accent { fill: url(#grad-accent); }
  `)
  .defs(undefined, defs)
  .text({ class: 'wordmark wordmark--base', x: 0, y: 82 }, 'svg-')
  .text({ class: 'wordmark wordmark--accent', x: 132, y: 82 }, 'builder')
  .render();

process.stdout.write(logo);
NODE
```

### SVG Buffer

When you need binary output, call `svg.buffer()`. In Node.js it returns a `Buffer` (which extends `Uint8Array`), while in browsers it produces a `Uint8Array` without pulling in any polyfills. The helper intentionally probes the environment so your code does not need to juggle runtime checks, preferring `Buffer.from` when available, falling back to `TextEncoder`, and finally to a tiny ASCII encoder. The result is safe to hand to file writers, HTTP clients, or any API expecting a `Uint8Array`.

### Updating Element Definitions

The list of supported elements and their permitted attributes is generated from the SVG 2 specification.

1. Download the latest copies of the SVG 2 indexes:
   - [Element index (eltindex.html)](https://www.w3.org/TR/SVG2/eltindex.html)
   - [Attribute index (attindex.html)](https://www.w3.org/TR/SVG2/attindex.html)
2. Replace `spec_data/eltindex.html` and `spec_data/attindex.html` with the downloaded files.
3. Regenerate the dataset:

```
npm run generate:defs
```

This rewrites `src/elements/definitions.ts` and `spec_data/element-attributes.json`. The build script runs this automatically, so published bundles always ship with the latest definitions.

### SVG Elements

svg-builder exposes a chainable method for every element defined in the [SVG 2 element index](https://w3c.github.io/svgwg/svg2-draft/eltindex.html) (63 elements, including filter primitives and animation elements). Each builder method mirrors the lowercase element name (`svg.feBlend()`, `svg.animateTransform()`, `svg.clipPath()`, etc.) and accepts an attributes object plus optional content.

### Contributing / Testing

- Run `npm test` (or `npx vitest run`) to execute the suite.
- Coverage checks are enabled by default; use `npx vitest run --coverage` if you want the detailed report.
- Before sending a PR that touches the spec data, run `npm run generate:defs` to refresh the derived files.
