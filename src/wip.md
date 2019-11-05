Builds upon the approved #363 PR for [typescript migration](https://github.com/linkeddata/rdflib.js/issues/355):

- Converted some of the most fundamental classes to typescript, including `Node`, `Literal`, `BlankNode`, `NamedNode`, `Collection`, `Statement`.
- Introduced a `.types` file for shared types.
- Included a temporary `types-temp.ts` file in project root as a reference file for documentation and keeping track of the ts migration process.
- The `.isVar` method is set to boolean values, instead of `0` or `1`. This seemed reasonable, as it's only used for boolean type checks, and the existing types already define it as a boolean value. Timbl confirmed that `isVar` is only used for boolean operations.
- JSDoc is switched with Typedoc. Combined with typescript, it makes the documentation far more complete.
- Sometimes I had to make assumptions on date types, e.g. that a user will never create a Statement containing a Collection. These assumptions used to be implicit, but typescript forces us to make them explicit. This happens when you see type assertions (value as type).
- Literals can apparently be null or undefined, when nodes are created using the `.fromValue` method. This happens in the Statement constructor. See #362.
- I used many of the descriptions and comments from `@types/rdflib` by [Cénotélie](https://github.com/cenotelie/). Added credits in `package.json`, discussed this with Cénotélie.

## New changes

- Migrated `formula`, `variable`, `store`, `update-manager`, `data-factory`, `default-graph`, `namespace`, `parse`,`serialize`, `parse`, `uri` and `utils` tot ts.
- Added `fork-ts-checker-webpack-plugin`, which enables errors in the log when ts errors occur.
- Added and implemented RDF/JS Taskforce (TF) types, included these in the `types.ts` file. I tried implementing the TF types in the major classes, but some of the incompatibilities make it difficult. Many available methods on rdfjs instances (e.g. `.toNt()` in NamedNode), are missing in TF classes. To improve TF comatibility, we should minimize using rdflib specific functions. This would for example enable using Forumla methods on RDFExt nodes. We should use the Taskforce types (TFTerm, TFQuad) as much as possible, instead of rdflib types (Node, Statement).
- Variables (from rdfjs taskforce) make typings a lot more complex (many methods would require explicit type checks, e.g. you can't serialize a variable to N-Triples), so I disabled them.
- Switched internal calls from `sameTerm` to `equals` in order to comply to TF spec, so that these functions also work with external datafactories.
- Added typeguards, e.g. `isTFNamedNode` and `isTFPredicate` in `Utils`, and used these at various locations.
- Use enums for `termType` and `contentType`, without breaking compatibility with regular strings.
- `Formula` Constructor arguments are optional - since some functions initialize empty Formulas.
- In `Formula.fromNT()` `return this.literal(str, lang || dt)` seemed wrong, converted it to
- The various `fromValue` methods conflict with the base Node class, type wise. Since they don't use `this`, I feel like they should be converted to functions.

## Minor fixes

- Removed the last conditional of `Formula.holds()`, since it did not make sense
- Removed some unreachable code, unused variables and functions that didn't do anything such as `Node.substitute()`.
- Removed the `justOne` argument from `formula.statementsMatching`, since it was unused.
- The `uri.document` function called `.uri` on a string, I removed that.
- Transformed inline comments to JSDoc, moved them to type declarations instead of constructor.
- Some types are set to any, because I didn't fully understand them. I've added TODO comments for these.
- Removed the fourth argument from the `parser.parse` function in `fetcher.parse`, since the function only takes three.
- Removed the `response` argument from `fetcher.parse`, `XHTMLHandler.parse`, `RDFXMLHander.parse`, `XMLHandler`, since it was not used.
- `Fetcher.failfetch` added strings as objects to the store. Changed that to literals.
- Internal calls to `NamedNode.uri` are changed to `.value` to comply with TF spec. This enables these functions to work with external datafactories.
- Removed unused second argument from `Fetcher.cleanupFetchRequest`
- Created one huge `Options` type for Fetcher. Not sure if this is the way to go.
- In `Node.toJS`, the boolean only returned true if the `xsd:boolean` value is `'1'`, now it it should also work for `'true'`.

## Language

Getting started with Linked Data or RDF can be difficult, since it introduces quite a few new concepts.
Since this library is powerful and generic, it might be one of the first and most important RDF tools that a developer will use.
Therefore, we should try to use consistent langauge and keep synonyms to a minimum.

- The name `Node` and `Term` refer to the same concept. Both are used in this repo. I think Term is a better word, not only because it complies to the TF spec, but also because it seems more sementically correct. A Literal, for examepl, is not really a `Node`, it's more of an `Edge`, but it still extends `Node`.
- `Statement`, `Triple` and `Quad` refer to the same concept. Maybe we could pick one: I suggest Statement.
- The concept `graph` is referred to as `why`, `doc` and `graph` in the code and API. I think this might be confusing - should we just call it `graph` everywhere?
- the `IndexedFormula` name is different from the `store` filename. It might be easier to just call it `store` everywhere.
- We have a lot of names for `a bunch of Statements`: `Graph` (which is also the fourth item of a `Quad`), `Document` / `doc`, `Store`, `Forumula`, `IndexedFormula`, `Collection`, `Resource`, `kb`... Some of these have clear differences, but I feel like we should try to eliminate part of the terminology to reduce the mental load on newcomers.

## Things I noticed:

- The `optional` argument in `formula.js` does not seem to be documented, used or tested - should it be removed?
- The `IndexedFormula.add()` method has logic for Statement array inputs and store inputs, but this behavior is not documented. It also refers to `this.fetcher` and `this.defaultGraph`, which both should not be available.
- The filenames of major classes differ from their default exports, e.g. `store.ts` is called `IndexedFormula`.

- Aliases (e.g. `IndexedFormula.match` for  `IndexefFormula.statementsMatching`) introduce complexity, documentation and type duplication. I suggest adding deprecation warnings.
- The various calling methods of `Fetcher.nowOrWhenFetched` are quite dynamic, I'd rather have a stricter type for each argument.
- The Variable type (or `TFVariable`) really messes with some assumptions. I feel like they should not be valid in regular quads, since it's impossible to serialize them decently. If I'd add it to the accepted types, we'd require a lot of typeguards in functions.
- Many promise functions could be converted to async.
- The `Fetcher` `StatusValues` should be `numbers`, but can be many types in RDFlib. This breaks compatibility with extending `Response` types. I feel we should only use the `499` browser error and add the message to the `requestbody`. I've created a type for the internal `Response`; it shows how it differs from regular `Response`s.
- The `IndexedFormula` and `Formula` methods have incompatible types, such as in `compareTerm`, `variable` and `add`. I've added commented `//@ts-ignore` lines.

## Weird behavior / possible bugs not fixed by this PR

- The `Parse.executeErrorCallback` conditional logic is always `true`.
- `Formula.substitute()` uses `this.add(Statments[])`, which will crash. I think it should be removed, since `IndexedFormula.substitute` is used all the time anyway.
- The `Formula.serialize` function calls `serialize.ts` with only one argument, so without a store. I think this will crash every time, maybe it's rotten code?
- `Formula.serialize` uses `this.namespaces`, but this is only defined in `IndexedFormula`
- `store.add()` accepts many types of inputs, but this will lead to invalid statements (e.g. a Literal as a Subject). I suggest we make this more strict and throw more errors on wrong inputs. Relates to #362. We could still make the allowed inputs bigger by allowing other types with some explicit behavior, e.g. in subject arguments, create `NamedNodes` from `URL` objects and `strings` that look like URLs . In any case, I thinkg the `Node.formValue` behavior is too unpredictable for `store.add`. For now, I've updated the docs to match its behavior.
- In `Fetcher.addtype`, the final logic will allways return `true`, since `redirection` is a `NamedNode`. Should it call `.value`?

## Unused code
- `IndexedFormula.predicateCallback` is checked, but never used in this codebase.

## Probably OK, but I don't get it:
- In `Fetcher`, `this.fireCallbacks` is called a few times, but it does not exist. Is this because of `callbackify`?
- I'm a bit embarassed about this, but even after rewriting so much of the code I still don't understand all methods. E.g. `Forumla.transitiveClosure()`
- Some functions in `Fetcher` assume that specific `Opts` are defined. I've included all these in a single `Opts` type, but I'm not sure about this approach.
