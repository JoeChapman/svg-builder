svg-builder
===========

Create SVG elements in NodeJS

### Install

```
npm install svg-builder
```

### Use

```js
    var svg = require('svg-builder')
        .width(125)
        .height(125);

    var logo = svg
        .circle({
            r: 40,
            fill: 'none',
            'stroke-width': 1,
            stroke: '#CB3728',
            cx: 42,
            cy: 82
        }).circle({
            r: 40,
            fill: 'none',
            'stroke-width': 1,
            stroke: '#3B92BC',
            cx: 84,
            cy: 82
        }).text({
            x: 10,
            y: 20,
            'font-family': 'helvetica',
            'font-size': 15,
            stroke : '#fff',
            fill: '#fff'
        }, 'My logo')
    ).render();
```

### Test

```
$ npm test
```

