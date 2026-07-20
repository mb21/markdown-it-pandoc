// source: https://github.com/markdown-it/markdown-it/blob/master/test/cmspec/commonmark.test.mjs

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { text } from 'commonmark-spec';
import mdIt from 'markdown-it';
import mdItPandoc from '../index.js';

function normalize(text) {
  return text.replace(/<blockquote>\n<\/blockquote>/g, '<blockquote></blockquote>');
}

function loadSpecExamples(input, md) {
  const spec = input.replace(/→/g, '\t');
  const examples = [];

  md.parse(spec, {})
    .filter((token) => token.tag === 'code' && token.info.trim() === 'example')
    .forEach((token) => {
      const arr = token.content.split(/^\.\s*?$/m, 2);
      examples.push({
        md: arr[0],
        html: arr[1].replace(/^\n/, ''),
        line: token.map[0],
      });
    });

  return examples;
}

const md = mdIt("default", { html: true, xhtmlOut: true })
  .use(mdItPandoc, {
    highlight: false,
    implicit_figures: false,
  });

describe('CommonMark', function () {
  loadSpecExamples(text, md).forEach((fixture) => {
    it(`line ${fixture.line}`, function () {
      assert.strictEqual(md.render(fixture.md), normalize(fixture.html));
    });
  });
});

