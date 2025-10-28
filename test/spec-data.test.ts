import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  ATTRIBUTE_NAMES,
  ELEMENT_NAMES,
  ELEMENT_ATTRIBUTE_INDICES,
  GEOMETRY_ATTRIBUTE_INDICES,
} from '../src/elements/definitions';

type SpecData = {
  elements: string[];
  attributes: string[];
  elementAttributeIndices: Record<string, number[]>;
  geometryAttributeIndices: Record<string, number[]>;
};

const specDataPath = resolve(__dirname, '../spec_data/element-attributes.json');
const specData = JSON.parse(readFileSync(specDataPath, 'utf8')) as SpecData;

describe('spec dataset consistency', () => {
  it('matches the element list', () => {
    expect(Array.from(ELEMENT_NAMES)).toEqual(specData.elements);
  });

  it('matches the attribute list', () => {
    expect(Array.from(ATTRIBUTE_NAMES)).toEqual(specData.attributes);
  });

  it('matches element attribute indices for every element', () => {
    ELEMENT_NAMES.forEach((name) => {
      expect(Array.from(ELEMENT_ATTRIBUTE_INDICES[name])).toEqual(specData.elementAttributeIndices[name]);
    });
  });

  it('matches geometry attribute indices', () => {
    expect(GEOMETRY_ATTRIBUTE_INDICES).toEqual(specData.geometryAttributeIndices);
  });
});
