"use strict";

module.exports = function markdownItPandoc(md, markdownItPandocOpts) {
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
               , mathjax:                    false
               , subscript:                  true
               , superscript:                true
               , task_lists:                 true
               }
             , markdownItPandocOpts)

  if (opts.bracketed_spans && opts.attributes) {
    md = md.use( require('markdown-it-bracketed-spans') );
  }

  if (opts.attributes) {
    // TODO: sanitize attrs (at least keys with `on*` and vals with `javascript:*`, see https://github.com/arve0/markdown-it-attrs#security
    md = md.use( require('markdown-it-attrs') )
  }

  if (opts.fenced_divs) {
    function render_with_attributes(tokens, idx, options, env, slf) {
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
    function render_without_attributes(tokens, idx) {
      var token     = tokens[idx]
        , className = token.info.trim()
        ;
      if (token.nesting === 1) {
        return '<div class="' + className + '">';
      } else {
        return '</div>';
      }
    }
    md = md.use( require('markdown-it-container'), 'dynamic', {
              // adapted from https://github.com/markdown-it/markdown-it-container/issues/23
              validate: function() { return true; },
              render: (opts.attributes ? render_with_attributes : render_without_attributes)
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

  if (opts.task_lists) {
    md = md.use( require('markdown-it-task-lists') );
  }

  if (opts.katex && !opts.mathjax) {
    md = md.use(
      require('markdown-it-texmath').use( require('katex') )
    );
  }

  if (opts.mathjax && !opts.katex) {
    md = md.use( require('markdown-it-mathjax3') );
  }

  return md;
}
