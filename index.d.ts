import MarkdownIt from 'markdown-it'

declare const markdownItPandoc: (md: MarkdownIt, opts?: {
  attributes?:       boolean;
  bracketed_spans?:  boolean;
  definition_lists?: boolean;
  fenced_divs?:      boolean;
  footnotes?:        boolean;
  implicit_figures?: boolean;
  grid_tables?:      boolean;
  katex?:            boolean;
  subscript?:        boolean;
  superscript?:      boolean;
  task_lists?:       boolean;
}) => MarkdownIt

export default markdownItPandoc
