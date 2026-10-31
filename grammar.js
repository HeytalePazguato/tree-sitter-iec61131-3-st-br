import base, { kw } from 'tree-sitter-iec61131-3-st/grammar.js';

export default grammar(base, {
  name: 'iec61131_3_st_br',
  rules: {
    // B&R `.var` files hold bare VAR blocks (`VAR`, `VAR CONSTANT`,
    // `VAR_GLOBAL RETAIN`, ...) directly at file level.
    _top_level_item: ($, original) => choice(original, $._var_block),

    // The base wraps a stand-alone top-level `VAR_GLOBAL` block in
    // `global_var_declaration_block`, which overlaps with `_var_block` above
    // and cannot be resolved by precedence. Dropping the wrapper from
    // `_declaration` makes `var_global` a direct child of `source_file`, like
    // every other top-level VAR block (the wrapper rule becomes unreachable).
    _declaration: ($) =>
      choice(
        $.program_declaration,
        $.function_declaration,
        $.function_block_declaration,
        $.interface_declaration,
        $.type_declaration,
        $.namespace_declaration,
        $.configuration_declaration,
      ),
  },
});
