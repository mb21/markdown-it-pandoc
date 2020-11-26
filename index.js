"use strict";

module.exports = function markdownItPandoc(markdownItOpts, markdownItPandocOpts) {
  var opts = Object.assign(
               {
                 attributes:                 true
               , bracketed_spans:            true
               , definition_lists:           true
               , fenced_divs:                true
               , footnotes:                  true
               , implicit_figures:           true
               , grid_tables:                true
               , katex:                      true
               , subscript:                  true
               , superscript:                true
               }
             , markdownItPandocOpts)

  var md = require('markdown-it')(markdownItOpts);

  if (opts.bracketed_spans && opts.attributes) {
    md = md.use( require('markdown-it-bracketed-spans') );
  }

  if (opts.attributes) {
    // TODO: sanitize attrs (at least keys with `on*` and vals with `javascript:*`, see https://github.com/arve0/markdown-it-attrs#security
    md = md.use( require('markdown-it-attrs') )
  }

  if (opts.fenced_divs && opts.attributes) {
    md = md.use( require('markdown-it-container'), 'dynamic', {
              // adapted from https://github.com/markdown-it/markdown-it-container/issues/23
              validate: function() { return true; },
              render: function(tokens, idx, options, env, slf) {
                var token     = tokens[idx]
                  , className = token.info.trim()
                  , renderedAttrs = slf.renderAttrs(token)
                  ;
                if (token.nesting === 1) {
                  return (className && className !== '{}')
                          ? '<div class="' + className + '">'
                          : '<div' + renderedAttrs + '>'
                          ;
                } else {
                  return '</div>';
                }
              }
            });
  }

  if (opts.definition_lists) {
    md = md.use( require('markdown-it-deflist') );
  }

  if (opts.footnotes) {
    md = md.use( require('markdown-it-footnote') );
  }

  if (opts.implicit_figures) {
    md = md.use( require('markdown-it-implicit-figures'), {figcaption: true} );
  }

  if (opts.grid_tables) {
    var gridtables = require('markdown-it-gridtables').default
    md = md.use(gridtables);
  }

  if (opts.subscript) {
    md = md.use( require('markdown-it-sub') );
  }

  if (opts.superscript) {
    md = md.use( require('markdown-it-sup') );
  }

  if (opts.katex) {
    md = md.use(
      require('markdown-it-texmath').use( require('katex') )
    );
  }

  return md;
}
