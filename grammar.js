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
        $.action_declaration,
      ),

    // The base has no ACTION construct. Same node name and fields as the Beckhoff
    // dialect so both expose identical nodes; `owner` is optional because B&R action
    // files are stored beside their program.
    action_declaration: ($) =>
      seq(
        kw('ACTION'),
        optional(seq(field('owner', $.identifier), '.')),
        field('name', $.identifier),
        optional(':'),
        optional(field('body', $.action_body)),
        kw('END_ACTION'),
      ),

    action_body: ($) => repeat1($._statement),

    // B&R calls an action without parentheses (`ResetAxis;`). Low precedence so it never
    // shadows an assignment or a call.
    _statement: ($, original) =>
      choice(original, $.action_call_statement, $.access_statement),

    action_call_statement: ($) => prec(-1, seq(field('name', $.identifier), ';')),

    // The base only knows `REF_TO`; B&R spells it `REFERENCE TO`. Same node name and
    // field as the Beckhoff dialect so both expose identical nodes.
    _type_specifier: ($, original) => choice(original, $.reference_to_type),

    reference_to_type: ($) =>
      seq(kw('REFERENCE'), kw('TO'), field('target', $._type_specifier)),

    // Binds a dynamic variable to an address: `pMotor ACCESS ADR(gMotor);`.
    access_statement: ($) =>
      seq(
        field('target', $._expression),
        kw('ACCESS'),
        field('address', $._expression),
        ';',
      ),
  },
});
