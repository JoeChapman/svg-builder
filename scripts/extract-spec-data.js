#!/usr/bin/env node

/**
 * Extracts SVG element and attribute data from locally stored specification HTML files.
 *
 * Expected input files (relative to project root):
 *  - spec_data/eltindex.html
 *  - spec_data/attindex.html
 *
 * Outputs a JSON document to stdout with the following shape:
 * {
 *   elements: string[],
 *   elementAttributes: { [elementName: string]: string[] }
 * }
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const elementIndexPath = path.join(projectRoot, 'spec_data', 'eltindex.html');
const attributeIndexPath = path.join(projectRoot, 'spec_data', 'attindex.html');
const outputFormat = process.argv.includes('--ts') ? 'ts' : 'json';

const readFile = (inputPath) => {
  try {
    return fs.readFileSync(inputPath, 'utf8');
  } catch (error) {
    throw new Error(`Unable to read ${inputPath}: ${error.message}`);
  }
};

const extractElementNames = (html) => {
  const elementNames = new Set();
  const elementPattern = /<span class="element-name">[\s\S]*?<span>([^<]+)<\/span>/g;
  let match;

  while ((match = elementPattern.exec(html)) !== null) {
    const rawName = match[1].trim();
    if (!rawName) {
      continue;
    }
    elementNames.add(rawName);
  }

  if (!elementNames.size) {
    throw new Error('No element names were extracted from the element index.');
  }

  return Array.from(elementNames);
};

const extractAttributeMappings = (html) => {
  const elementAttributesMap = new Map();
  const rowPattern = /<tr>([\s\S]*?)<\/tr>/g;
  let rowMatch;

  while ((rowMatch = rowPattern.exec(html)) !== null) {
    const row = rowMatch[1];
    const attributeMatch = row.match(/<span class="attr-name">[\s\S]*?<span>([^<]+)<\/span>/);
    if (!attributeMatch) {
      continue;
    }
    const attributeName = attributeMatch[1].trim();
    if (!attributeName) {
      continue;
    }
    const elementMatches = Array.from(row.matchAll(/<span class="element-name">[\s\S]*?<span>([^<]+)<\/span>/g));
    if (!elementMatches.length) {
      continue;
    }

    elementMatches.forEach((elementMatch) => {
      const elementName = elementMatch[1].trim();
      if (!elementName) {
        return;
      }
      if (!elementAttributesMap.has(elementName)) {
        elementAttributesMap.set(elementName, new Set());
      }
      elementAttributesMap.get(elementName).add(attributeName);
    });
  }

  return elementAttributesMap;
};

const indent = (level) => '  '.repeat(level);

const formatArray = (items, level = 0, formatter = JSON.stringify) => {
  if (!items.length) {
    return '[]';
  }
  const baseIndent = indent(level);
  const innerIndent = indent(level + 1);
  return `[\n${items.map((item) => `${innerIndent}${formatter(item)},`).join('\n')}\n${baseIndent}]`;
};

const main = () => {
  const elementIndexHtml = readFile(elementIndexPath);
  const attributeIndexHtml = readFile(attributeIndexPath);

  const elements = extractElementNames(elementIndexHtml);
  const attributeMappings = extractAttributeMappings(attributeIndexHtml);

  const elementAttributes = {};
  elements.forEach((element) => {
    const attributes = attributeMappings.get(element);
    if (!attributes) {
      elementAttributes[element] = ['core'];
      return;
    }
    const withCore = new Set(attributes);
    withCore.add('core');
    elementAttributes[element] = Array.from(withCore).sort((a, b) => a.localeCompare(b));
  });

  const attributeSet = new Set(['presentation']);
  Object.values(elementAttributes).forEach((attributes) => {
    attributes.forEach((attribute) => {
      attributeSet.add(attribute);
    });
  });

  const attributeNames = Array.from(attributeSet).sort((a, b) => a.localeCompare(b));
  const attributeIndicesLookup = new Map(attributeNames.map((name, index) => [name, index]));

  const elementAttributeIndices = {};
  elements.forEach((element) => {
    const attributes = elementAttributes[element] || [];
    elementAttributeIndices[element] = attributes.map((attribute) => {
      const index = attributeIndicesLookup.get(attribute);
      if (typeof index !== 'number') {
        throw new Error(`Missing attribute index for ${attribute}`);
      }
      return index;
    });
  });

  const sortedElements = elements.sort((a, b) => a.localeCompare(b));

  if (outputFormat === 'ts') {
    const formatElementAttributeIndices = () => {
      if (!sortedElements.length) {
        return '{} as const';
      }
      const body = sortedElements.map((name) => {
        const indices = elementAttributeIndices[name] || [];
        return `${indent(1)}${JSON.stringify(name)}: ${formatArray(indices, 2, String)} as const,`;
      });
      return `{\n${body.join('\n')}\n}`;
    };

    const ts = `export const ELEMENT_NAMES = ${formatArray(sortedElements)} as const;

export type ElementName = typeof ELEMENT_NAMES[number];

export const ATTRIBUTE_NAMES = ${formatArray(attributeNames)} as const;

export type AttributeName = typeof ATTRIBUTE_NAMES[number];

export const ELEMENT_ATTRIBUTE_INDICES: Record<ElementName, readonly number[]> = ${formatElementAttributeIndices()} as const;
`;
    process.stdout.write(ts);
    return;
  }

  const payload = {
    elements: sortedElements,
    attributes: attributeNames,
    elementAttributeIndices,
  };

  process.stdout.write(JSON.stringify(payload, null, 2));
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
