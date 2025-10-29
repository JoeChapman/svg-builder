# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.4] - 2025-10-29
### Added
- Recognised additional SVG geometry attributes, including `transform` on shapes and positioning attributes (`x`, `y`, `href`) for `<use>` so complex scenes (e.g. the orb example) validate.

### Changed
- Documented the gradient wordmark workflow and other CLI SVG generation examples in the README.

### Fixed
- Prevented CLI logo/orb scripts from failing when `use` or gradient helpers rely on the newly recognised attribute set.

## [3.0.3] - 2024-12-09
### Added
- Started a project changelog following Keep a Changelog format.
- Added CLI documentation examples for generating the README wordmark and a hard-hat SVG using `svg-builder`.
- Enabled string content for `<style>`, `<title>`, and `<desc>` elements and exposed geometry attributes for `<path>`, `<polygon>`, and `<polyline>`.

### Changed
- Simplified the README hero logo to a two-color wordmark generated with `svg-builder`.

### Fixed
- Geometry attributes (e.g., `d`, `points`) now pass validation when building shapes such as hard hats or composite logos.

[3.0.4]: https://github.com/JoeChapman/svg-builder/releases/tag/v3.0.4
[3.0.3]: https://github.com/JoeChapman/svg-builder/releases/tag/v3.0.3
