
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import katex from 'katex';
import mdIt from 'markdown-it';
import mdItPandoc from '../index.js';

const md = mdIt().use(mdItPandoc);

describe('bracketed-spans', () => {
  it('base', () => {
    assert.strictEqual(
      md.render('foo [bar *bar*]{#id .class attr=value} baz'),
      '<p>foo <span id="id" class="class" attr="value">bar <em>bar</em></span> baz</p>\n'
    );
  });

  it('supports the manual example', () => {
    assert.strictEqual(
      md.render('[This is *some text*]{.class key="some val"}'),
      '<p><span class="class" key="some val">This is <em>some text</em></span></p>\n'
    );
  });
  it('nested link', () => {
    assert.strictEqual(
      md.render('[This is an example of [Google](www.google.com)]{.class}'),
      '<p><span class="class">This is an example of <a href="www.google.com">Google</a></span></p>\n',
    );
  });
  it('nested link 2', () => {
    assert.strictEqual(
      md.render('[This is an example of [Google]{.class}](www.google.com)'),
      '<p><a href="www.google.com">This is an example of <span class="class">Google</span></a></p>\n',
    );
  });
  it('double opening bracket', () => {
    assert.strictEqual(
      md.render('[[b]{}'),
      '<p>[<span>b</span>{}</p>\n',
    );
  });
});

describe('markdown-it-attrs', () => {
  it('header', () => {
    assert.strictEqual(
      md.render('# header {.style-me}\npara'),
      '<h1 class="style-me">header</h1>\n<p>para</p>\n'
    );
  });
  it('inline', () => {
    assert.strictEqual(
      md.render('paragraph *style me*{.red} more text'),
      '<p>paragraph <em class="red">style me</em> more text</p>\n'
    );
  });
  it('codeblock', () => {
    assert.strictEqual(
      md.render('```python {data=asdf}\nx = 2\n```'),
      '<pre><code data="asdf" class="language-python">x = <span class="hljs-number">2</span>\n</code></pre>\n',
    );
  });
});

describe('container', () => {
  it('base', () => {
    assert.strictEqual(
      md.render('::::: {#special .sidebar}\nA paragraph.\n\nAnd another.\n:::::'),
      '<div id="special" class="sidebar"><p>A paragraph.</p>\n<p>And another.</p>\n</div>',
    );
  });

  it('warning', () => {
    assert.strictEqual(
      md.render(`::: Warning
This is a warning.

::: Danger
This is a warning within a warning.
:::
::::::::::::::::::`),
      '<div class="Warning"><p>This is a warning.</p>\n' +
      '<div class="Danger"><p>This is a warning within a warning.</p>\n' +
      '</div></div><div></div>',
    );
  });
});

describe('task-lists', () => {
  it('supports checked and unchecked items', () => {
    assert.strictEqual(
      md.render('- [ ] an unchecked task list item\n- [x] checked item'),
      '<ul class="contains-task-list">\n' +
      '<li class="task-list-item"><input class="task-list-item-checkbox" disabled="" type="checkbox"> an unchecked task list item</li>\n' +
      '<li class="task-list-item"><input class="task-list-item-checkbox" checked="" disabled="" type="checkbox"> checked item</li>\n' +
      '</ul>\n'
    );
  });
});

describe('definition-lists', () => {
  it('supports multiple terms and inline markup', () => {
    assert.strictEqual(
      md.render(`Term 1

:   Definition 1

Term 2 with *inline markup*

:   Definition 2`),
      '<dl>\n' +
      '<dt>Term 1</dt>\n' +
      '<dd>Definition 1</dd>\n' +
      '<dt>Term 2 with <em>inline markup</em></dt>\n' +
      '<dd>Definition 2</dd>\n' +
      '</dl>\n'
    );
  });

  it('supports multiple definitions for a term', () => {
    assert.strictEqual(
      md.render(`Term
  ~ Definition 1
  ~ Definition 2`),
      '<dl>\n' +
      '<dt>Term</dt>\n' +
      '<dd>Definition 1</dd>\n' +
      '<dd>Definition 2</dd>\n' +
      '</dl>\n'
    );
  });
});

describe('footnotes', () => {
  it('numbers referenced notes sequentially', () => {
    assert.strictEqual(
      md.render(`Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here is the longer footnote.`),
      '<p>Here is a footnote reference,<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> and another.<sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup></p>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes">\n' +
      '<ol class="footnotes-list">\n' +
      '<li id="fn1" class="footnote-item"><p>Here is the footnote. <a href="#fnref1" class="footnote-backref">↩︎</a></p>\n' +
      '</li>\n' +
      '<li id="fn2" class="footnote-item"><p>Here is the longer footnote. <a href="#fnref2" class="footnote-backref">↩︎</a></p>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>\n'
    );
  });

  it('supports inline notes', () => {
    assert.strictEqual(
      md.render('Here is an inline note.^[Inline notes are easier to write.]'),
      '<p>Here is an inline note.<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup></p>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes">\n' +
      '<ol class="footnotes-list">\n' +
      '<li id="fn1" class="footnote-item"><p>Inline notes are easier to write. <a href="#fnref1" class="footnote-backref">↩︎</a></p>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>\n'
    );
  });
});

describe('implicit-figures', () => {
  it('uses the image description as a caption', () => {
    assert.strictEqual(
      md.render('![This is the caption.](image.png)'),
      '<figure><img src="image.png" alt=""><figcaption>This is the caption.</figcaption></figure>\n'
    );
  });

  it('leaves an image inline when it is not alone', () => {
    assert.strictEqual(
      md.render('An inline ![image](foo.jpg).'),
      '<p>An inline <img src="foo.jpg" alt="image">.</p>\n'
    );
  });
});

describe('grid-tables', () => {
  it('supports block content in cells', () => {
    assert.strictEqual(
      md.render(`+---------------+---------------+--------------------+
| Fruit         | Price         | Advantages         |
+===============+===============+====================+
| Bananas       | $1.34         | - built-in wrapper |
|               |               | - bright color     |
+---------------+---------------+--------------------+
| Oranges       | $2.10         | - cures scurvy     |
|               |               | - tasty            |
+---------------+---------------+--------------------+`),
      '<table>\n' +
      '<thead>\n<tr>\n<th>Fruit</th>\n<th>Price</th>\n<th>Advantages</th>\n</tr>\n</thead>\n' +
      '<tbody>\n' +
      '<tr>\n<td>Bananas</td>\n<td>$1.34</td>\n<td>\n<ul>\n<li>built-in wrapper</li>\n<li>bright color</li>\n</ul></td>\n</tr>\n' +
      '<tr>\n<td>Oranges</td>\n<td>$2.10</td>\n<td>\n<ul>\n<li>cures scurvy</li>\n<li>tasty</li>\n</ul></td>\n</tr>\n' +
      '</tbody>\n</table>\n'
    );
  });
});

describe('superscript-and-subscript', () => {
  it('supports both forms in a sentence', () => {
    assert.strictEqual(
      md.render('H~2~O is a liquid.  2^10^ is 1024.'),
      '<p>H<sub>2</sub>O is a liquid.  2<sup>10</sup> is 1024.</p>\n'
    );
  });

  it('supports escaped spaces in subscripts', () => {
    assert.strictEqual(
      md.render('P~a\\ cat~'),
      '<p>P<sub>a cat</sub></p>\n'
    );
  });
});

describe('tex-math-dollars', () => {
  it('renders inline TeX with KaTeX', () => {
    assert.strictEqual(
      md.render('Euler wrote $e^{i\\pi} + 1 = 0$.'),
      '<p>Euler wrote <eq>' +
      katex.renderToString('e^{i\\pi} + 1 = 0') +
      '</eq>.</p>\n'
    );
  });

  it('renders display TeX with KaTeX', () => {
    assert.strictEqual(
      md.render('$$\\int_0^1 x^2 dx$$'),
      '<section><eqn>' +
      katex.renderToString('\\int_0^1 x^2 dx', { displayMode: true }) +
      '</eqn></section>'
    );
  });

  it('does not treat currency as TeX math', () => {
    assert.strictEqual(
      md.render('$20,000 and $30,000'),
      '<p>$20,000 and $30,000</p>\n'
    );
  });
});
