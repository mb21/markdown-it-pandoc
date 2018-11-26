# markdown-it-pandoc

Package bundling a few [markdown-it](https://github.com/markdown-it/markdown-it)
plugins to approximate [pandoc flavoured markdown](http://pandoc.org/MANUAL.html#pandocs-markdown).

Requires a lot of peer dependencies, depending on which extensions you enable.
It's probably best if you take a quick look at [the source](./index.js).


## Usage

```javascript
var md = require('markdown-it-pandoc')()
md.render('my markdown string')
```

There are two optional arguments. The first is passed on
[directly to markdown-it](https://github.com/markdown-it/markdown-it#init-with-presets-and-options).
With the second you can enable/disable `markdown-it-pandoc` extensions. For example:

```javascript
var md = require('markdown-it-pandoc')(
           {
             html: true
           }, {
             implicit_figures: false
           }
         )
```
