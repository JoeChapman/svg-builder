#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const cjsDir = path.join(__dirname, '..', 'dist', 'cjs');
const bridgePath = path.join(cjsDir, 'index.cjs');
const importPath = './index.js';
const esmPackagePath = path.join(__dirname, '..', 'dist', 'esm', 'package.json');

const bridgeSource = `'use strict';
const mod = require(${JSON.stringify(importPath)});
const exported = mod && mod.__esModule ? mod.default : mod;
module.exports = exported;
module.exports.default = exported;
`;

fs.mkdirSync(cjsDir, { recursive: true });
fs.writeFileSync(bridgePath, bridgeSource);
fs.mkdirSync(path.dirname(esmPackagePath), { recursive: true });
fs.writeFileSync(esmPackagePath, JSON.stringify({ type: 'module' }, null, 2));
