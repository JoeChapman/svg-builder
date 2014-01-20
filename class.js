'use strict';

var prop = Object.defineProperty,
    getPropDesc = Object.getOwnPropertyDescriptor,
    Class = {};

function extendProps(onto, from) {
    var props = Object.getOwnPropertyNames(from),
        replace,
        i;
    for (i = 0; i < props.length; ++i) {
        replace = getPropDesc(onto, props[i]);
        if (!(props[i] in Function) && (!replace || replace.writable)) {
            prop(onto, props[i], getPropDesc(from, props[i]));
        }
    }
}

function extend(parent, protoProps, staticProps) {
    var child;

    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function subClass() {
            return child.super.apply(this, arguments);
        };
    }

    prop(child, 'super', { value: parent });

    extendProps(child, parent);
    if (staticProps) {
        extendProps(child, staticProps);
    }

    child.prototype = Object.create(parent, {
        constructor: {
            value: child,
            enumerable: false,
            writable: true,
            configurable: true
        },
    });

    if (protoProps) {
        extendProps(child.prototype, protoProps);
    }
    return child;
}

prop(Class, 'extend', {
    configurable: true,
    writable: true,
    value: function ElementExtend(protoProps, staticProps) {
        return extend(this, protoProps, staticProps);
    },
});

module.exports = Class;