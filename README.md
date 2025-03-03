# markdown-it-pandoc

Package bundling a few [markdown-it](https://github.com/markdown-it/markdown-it)
plugins to approximate [pandoc flavoured markdown](http://pandoc.org/MANUAL.html#pandocs-markdown).

For a demo, you can try [PanWriter](https://panwriter.com).

## Dependencies

This package requires a lot of peer dependencies, depending on which extensions you enable.
For up-to-date information, it is probably best to take a quick look at [the source](./index.js).

| Options                          | Plugin dependency            |
|----------------------------------|------------------------------|
| `bracketed_spans` + `attributes` | markdown-it-bracketed-spans  |
| `attributes`                     | markdown-it-attrs            |
| `fenced_divs` + `attributes`     | markdown-it-container        |
| `definition lists`               | markdown-it-deflist          |
| `footnotes`                      | markdown-it-footnote         |
| `implicit_figures`               | markdown-it-implicit-figures |
| `grid_tables`                    | markdown-it-gridtables       |
| `subscript`                      | markdown-it-sub              |
| `superscript`                    | markdown-it-sup              |
| `task_lists`                     | markdown-it-task-lists       |
| `katex`                          | markdown-it-texmath, katex   |
| `mathjax`                        | markdown-it-mathjax3         |
| `highlightjs`                    | markdown-it-highlightjs      |

## Usage

```javascript
var md = require('markdown-it')();
require('markdown-it-pandoc')(md);
md.render('my markdown string');
```

There is an optional second argument to enable/disable `markdown-it-pandoc` extensions. For example:

```javascript
var md = require('markdown-it')({ html: true });
require('markdown-it-pandoc')(md, { implicit_figures: false });
md.render('my markdown string');
```

Or using import syntax:

```javascript
import markdownIt from 'markdown-it'
import markdownItPandoc from 'markdown-it-pandoc'

const md = markdownItPandoc(
  markdownIt({ html: true }),
  { implicit_figures: false }
);
md.render('my markdown string');
```
Note that MathJax and KaTeX are exclusive features.
You cannot set both options true.