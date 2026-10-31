# tree-sitter-iec61131-3-st-br

Tree-sitter grammar for B&R Automation Studio Structured Text, extending [tree-sitter-iec61131-3-st](https://github.com/HeytalePazguato/tree-sitter-iec61131-3-st) through tree-sitter's grammar-extension mechanism.

**Status: pre-0.1.0.** The repository currently contains only the toolchain (package, CI, release workflows); the grammar lands in the following tasks and nothing is published to npm yet.

## Scope

The dialect targets the B&R Automation Studio file forms (`.st`, `.fun`, `.var`, `.typ`, and `.fub`/`.stpp` for ST-OOP) and adds only B&R-specific syntax on top of the base grammar, such as top-level `VAR` blocks, `ACTION` files, and the dynamic-variable constructs `REFERENCE TO` and `ACCESS`.

## Development

Requires Node 24 or newer.

```sh
npm ci
npx tree-sitter --version
```

Work happens on `develop`; releases go through `release/*` branches into `main`. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
