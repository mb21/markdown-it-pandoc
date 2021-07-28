# markdown-it-pandoc

Package bundling a few [markdown-it](https://github.com/markdown-it/markdown-it)
plugins to approximate [pandoc flavoured markdown](http://pandoc.org/MANUAL.html#pandocs-markdown).

For a demo, you can try [PanWriter](https://panwriter.com).

## Dependencies

This package requires a lot of peer dependencies, depending on which extensions you enable.
For up-to-date information, it is probably best to take a quick look at [the source](./index.js).

| Options | Plugin dependency |
|---------|-------------------|
| `bracketed_spans` + `attributes` | markdown-it-bracketed-spans |
| `attributes` | markdown-it-attrs |
| `fenced_divs` + `attributes` | markdown-it-container |
| `definition lists` | markdown-it-deflist |
| `footnotes` | markdown-it-footnote |
| `implicit_figures` | markdown-it-implicit-figures |
| `grid_tables` | markdown-it-gridtables |
| `subscript` | markdown-it-sub |
| `superscript` | markdown-it-sup |
| `katex` | markdown-it-texmath, katex |


## Usage

```javascript
var md = require('markdown-it-pandoc')()
md.render('my markdown string')
```

There are two optional arguments. The first is passed on
[directly to markdown-it](https://github.com/markdown-it/markdown-it#init-with-presets-and-options).
With the second you can enable/disable `markdown-it-pandoc` extensions. For example:

```javascript
var md = require('markdown-it-pandoc')({
  html: true
}, {
  implicit_figures: false
})
```
