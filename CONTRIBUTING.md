# Contributing to svg-builder

Thanks for your interest in improving **svg-builder**! This guide covers the basics of setting up the project, running tests, regenerating the SVG definition data, and preparing a release.

---

## Prerequisites

- **Node.js ≥ 22** (for local development and tests)
  - `.nvmrc` / `.node-version` are provided for nvm/ASDF users.
- **npm ≥ 9** (ships with recent Node releases)

Install project dependencies:

```bash
npm ci
```

---

## Development workflow

### Running the test suite

```bash
# Run all unit tests
npm test

# Run with coverage (html/text reports)
npx vitest run --coverage
```

### Linting

```bash
npm run lint
```

### Building the packages

```bash
npm run build
```

`npm run build` automatically regenerates the SVG element/attribute dataset (`npm run generate:defs`), cleans `dist`, builds both ESM and CJS bundles, and creates the CJS bridge.

---

## Updating SVG element & attribute definitions

The runtime definitions are derived from the SVG 2 specification:

1. Download the latest copies of:
   - [Element index (eltindex.html)](https://www.w3.org/TR/SVG2/eltindex.html)
   - [Attribute index (attindex.html)](https://www.w3.org/TR/SVG2/attindex.html)
2. Replace `spec_data/eltindex.html` and `spec_data/attindex.html`.
3. Run the generator:

   ```bash
   npm run generate:defs
   ```

   This command rewrites:
   - `src/elements/definitions.ts`
   - `spec_data/element-attributes.json`

4. Commit the updated files alongside your changes.

The consistency test `test/spec-data.test.ts` ensures the TypeScript definitions and JSON dataset remain in sync.

---

## Submitting changes

1. Create a feature branch from `main`.
2. Make your changes and add/update tests where needed.
3. Run:
   ```bash
   npm run build
   npm run lint
   npm test
   ```
4. Commit with a descriptive message, then open a pull request.

---

## Release process (maintainers)

1. Bump the version in `package.json` / `package-lock.json`, update changelog.
2. `git commit` and push to `main`.
3. Tag the commit with the matching semver (e.g. `git tag v3.0.1 && git push origin v3.0.1`).
4. Publish the GitHub release (`Release` → `Publish`).

The CI workflow will:
- Run tests/build on the new tag.
- Publish the package to npm using the `NPM_TOKEN` secret.

---

## Questions?

Feel free to open an issue or start a discussion if you have questions about the codebase or contributing workflow. Thanks again for helping make **svg-builder** better!
