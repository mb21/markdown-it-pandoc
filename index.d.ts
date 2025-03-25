import MarkdownIt from 'markdown-it'

interface MarkdownItPandocOptions {
  attributes?:       boolean;
  bracketed_spans?:  boolean;
  definition_lists?: boolean;
  fenced_divs?:      boolean;
  footnotes?:        boolean;
  implicit_figures?: boolean;
  grid_tables?:      boolean;
  katex?:            boolean;
  mathjax?:          boolean;
  subscript?:        boolean;
  superscript?:      boolean;
  task_lists?:       boolean;
  highlight?:        boolean;
  highlight_inline?: boolean;
  tex_math_dollars?: boolean;
  tex_math_single_backslash?: boolean;
}

declare const markdownItPandoc: (md: MarkdownIt, opts?: MarkdownItPandocOptions) => MarkdownIt

// Export both the function and the options interface
declare namespace markdownItPandoc {
  export { MarkdownItPandocOptions };
}

// Export using CommonJS style
export = markdownItPandoc;
