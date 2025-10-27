import { afterEach } from 'vitest';
import svgBuilder from '../src/index';

afterEach(() => {
  svgBuilder.newInstance();
});
