Builds upon the approved #363 PR for [typescript migration](https://github.com/linkeddata/rdflib.js/issues/355):

- Converted some of the most fundamental classes to typescript, including Node, Literal, BlankNode, NamedNode, Collection, Statement.
- Introduced a .types file for shared types.
- Included a temporary types-temp.ts file in project root as a reference file for documentation and keeping track of the ts migration process.
- The .isVar method is set to boolean values, instead of 0 or 1. This seemed reasonable, as it's only used for boolean type checks, and the existing types already define it as a boolean value.
- JSDoc is switched with Typedoc. Combined with typescript, it makes the documentation far more complete.
- Sometimes I had to make assumptions on date types, e.g. that a user will never create a Statement containing a Collection. These assumptions used to be implicit, but typescript forces us to make them explicit. This happens when you see type assertions (value as type).
- Literals can apparently be null or undefined, when nodes are created using the .fromValue method. This happens in the Statement constructor. See #362.

New in this PR:

- Added and implemented RDFJS Taskforce (TF) types, included these in the `types.ts` file. I tried implementing the TF types in the major classes, but some of the incompatibilities make it difficult. Many available methods on rdfjs instances (e.g. `.toNt()` in NamedNode), are missing in TF classes. To improve TF comatibility, we should minimize using rdflib specific functions. This would for example enable using Forumla methods on RDFExt nodes. We should use the Taskforce types (Term, RDFJSQuad) as much as possible, instead of rdflib types (Node, Statement).
- Variables (from rdfjs taskforce) make typings a lot more complex, so I left them out.
- Switched internal calls from `sameTerm` to `equals` in order to comply to TF spec.
- Migrated `formula`, `variable`, `store`, `update-manager`, `data-factory` and `parse` tot ts
- Added typeguards, e.g. `isTFNamedNode`
- Use enums for `termType`, without breaking compatibility with regular strings
- The 'optional' argument in `formula.js` does not seem to be documented, used or tested - should it be removed?
- Removed the `justOne` argument from `formula.statementsMatching`, since it was unused. Also edited the call in `anyStatementMatching`
- Removed unreachable code and unused variables.
- `Node.substitute()` didn't to anything, so I removed it.
- Formula Constructor arguments are optional - since some functions initialize empty Formulas
- Removed the last conditional of `Formula.holds()`, since it did not make sense
- In `Formula.fromNT()` `return this.literal(str, lang || dt)` seemed wrong, converted it to
- The various `fromValue` methods conflict with the base Node class, type wise. Since they don't use `this`, I feel like they should be converted to functions.

Things I noticed:

- I don't understand the `Forumla.transitiveClosure()` method.
- In `Node.toJS`, the boolean only returns true is the `xsd:boolean` value is `'1'`, but I think it should also work for `'true'`.
- The `IndexedFormula.add()` method has logic for Statement array inputs and store inputs, but this behavior is not documented. It also refers to `this.fetcher` and `this.defaultGraph`, which both should not be available.
- The filenames of major classes differ from
