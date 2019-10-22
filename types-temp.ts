// This is a Temporary file to help with the migration to typescript.
// See issue: https://github.com/linkeddata/rdflib.js/issues/355
// Migrate these types and comments to the according files, then remove them from this list.
// Don't import types from this file.
// When you do want to use a type from this file, move it to `./types.ts`
// And import it here.

import {
    Bindings,
    ValueType,
} from './src/types';
import { NamedNode } from './src';

// Type definitions for rdflib 0.20
// Project: http://github.com/linkeddata/rdflib.js
// Definitions by: Cénotélie <https://github.com/cenotelie>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0
// Acknowledgements: This work has been financed by Logilab SA, FRANCE, logilab.fr

/**
* The RDF default graph
*/
export interface DefaultGraph extends Node {
  /**
   * Initializes this graph
   */
  constructor();
}
export namespace uri {
  /**
   * Gets the document part of an URI
   * @param uri The URI
   */
  function docpart(uri: string): string;
  /**
   * Gets the document part of an URI as a named node
   * @param x The URI
   */
  function document(x: string): NamedNode;
  /**
   * Gets the hostname in an URI
   * @param u The URI
   */
  function hostpart(u: string): string;
  /**
   * Joins an URI with a base
   * @param given The relative part
   * @param base The base URI
   */
  function join(given: string, base: string): string;
  /**
   * Gets the protocol part of an URI
   * @param uri The URI
   */
  function protocol(uri: string): string;
  /**
   * Gets a relative uri
   * @param base The base URI
   * @param uri The absolute URI
   */
  function refTo(base: string, uri: string): string;
}
export namespace log {
  /**
   * Logs a debug event
   * @param x The event
   */
  function debug(x: any): void;
  /**
   * Logs a warning event
   * @param x The event
   */
  function warn(x: any): void;
  /**
   * Logs an information event
   * @param x The event
   */
  function info(x: any): void;
  /**
   * Logs an error event
   * @param x The event
   */
  function error(x: any): void;
  /**
   * Logs a success event
   * @param x The event
   */
  function success(x: any): void;
  /**
   * Logs a message event
   * @param x The event
   */
  function msg(x: any): void;
}

export namespace convert {
  /**
   * Converts an n3 string to JSON
   * @param n3String The n3 string
   * @param jsonCallback Callback when the operation terminated
   */
  function convertToJson(
      n3String: string,
      jsonCallback: (err: string, jsonString: string) => void
  ): void;
  /**
   * Converts an n3 string to n-quads
   * @param n3String The n3 string
   * @param nquadCallback Callback when the operation terminated
   */
  function convertToNQuads(
      n3String: string,
      nquadCallback: (err: string, nquadString: string) => void
  ): void;
}
/**
* A formula, or store of RDF statements
*/
export interface Formula extends Node {
  /**
   * The stored statements
   */
  statements: Statement[];
  /**
   * Initializes this formula
   * @param statements The initial statements in this formulat
   * @param constraints The additional constraints
   * @param initBindings The initial bindings
   * @param optional
   */
  constructor(
      statements: ReadonlyArray<Statement>,
      constraints: ReadonlyArray<any>,
      initBindings: {
          [id: string]: Node;
      },
      optional: ReadonlyArray<any>
  );
  /**
   * Adds a statement to this formula
   * @param s The subject
   * @param p The predicate
   * @param o The object
   * @param g The graph that contains the statement
   */
  add(s: Node, p: NamedNode, o: Node, g: NamedNode): number;
  /**
   * Adds a statement to this formula
   * @param st The statement to add
   */
  addStatement(st: Statement): number;
  /**
   * Gets a blank node
   * @param id The node's identifier
   */
  bnode(id: string): BlankNode;
  /**
   * Adds all the statements to this formula
   * @param statements A collection of statements
   */
  addAll(statements: Iterable<Statement>): void;
  /**
   * Gets a node that matches the specified pattern
   * @param s The subject
   * @param p The predicate
   * @param o The object
   * @param g The graph that contains the statement
   */
  any(
      s?: Node | null,
      p?: Node | null,
      o?: Node | null,
      g?: Node | null
  ): Node | null;
  /**
   * Gets the value of a node that matches the specified pattern
   * @param s The subject
   * @param p The predicate
   * @param o The object
   * @param g The graph that contains the statement
   */
  anyValue(
      s?: Node | null,
      p?: Node | null,
      o?: Node | null,
      g?: Node | null
  ): string;
  /**
   * Gets the first JavaScript object equivalent to a node based on the specified pattern
   * @param s The subject
   * @param p The predicate
   * @param o The object
   * @param g The graph that contains the statement
   */
  anyJS(
      s?: Node | null,
      p?: Node | null,
      o?: Node | null,
      g?: Node | null
  ): any;
  /**
   * Gets the first statement that matches the specified pattern
   * @param subj The subject
   * @param pred The predicate
   * @param obj The object
   * @param why The graph that contains the statement
   */
  anyStatementMatching(
      subj?: Node | null,
      pred?: Node | null,
      obj?: Node | null,
      why?: Node | null
  ): Statement;
  /**
   * Gets the statements matching the specified pattern
   * @param subj The subject
   * @param pred The predicate
   * @param obj The object
   * @param why The graph that contains the statement
   * @param justOne Whether to only get one statement
   */
  statementsMatching(
      subj?: Node | null,
      pred?: Node | null,
      obj?: Node | null,
      why?: Node | null,
      justOne?: boolean
  ): Statement[];
  /**
   * Finds the types in the list which have no *stored* subtypes
   * These are a set of classes which provide by themselves complete
   * information -- the other classes are redundant for those who
   * know the class DAG.
   * @param types A map of the types
   */
  bottomTypeURIs(types: {
      [id: string]: string | NamedNode;
  }): {
      [id: string]: string | NamedNode;
  };
  /**
   * Gets a new collection
   */
  collection(): Collection;
  /**
   * Gets each node that matches the specified pattern
   * @param s The subject
   * @param p The predicate
   * @param o The object
   * @param g The graph that contains the statement
   */
  each(
      s?: Node | null,
      p?: Node | null,
      o?: Node | null,
      g?: Node | null
  ): Node[];
  /**
   * Gets whether this formula is equals to the other one
   * @param other The other formula
   */
  equals(other: Formula): boolean;
  /**
   * For thisClass or any subclass, anything which has it is its type
   * or is the object of something which has the type as its range, or subject
   * of something which has the type as its domain
   * We don't bother doing subproperty (yet?)as it doesn't seeem to be used
   * much.
   * Get all the Classes of which we can RDFS-infer the subject is a member
   * @param thisClass A named node
   */
  findMembersNT(
      thisClass: Node
  ): {
      [uri: string]: Statement;
  };
  /**
   * For thisClass or any subclass, anything which has it is its type
   * or is the object of something which has the type as its range, or subject
   * of something which has the type as its domain
   * We don't bother doing subproperty (yet?)as it doesn't seeem to be used
   * much.
   * Get all the Classes of which we can RDFS-infer the subject is a member
   * @param subject A named node
   */
  findMemberURIs(
      subject: Node
  ): {
      [uri: string]: Statement;
  };
  /**
   * Get all the Classes of which we can RDFS-infer the subject is a superclass
   * Returns a hash table where key is NT of type and value is statement why we
   * think so.
   * Does NOT return terms, returns URI strings.
   * We use NT representations in this version because they handle blank nodes.
   * @param subject A subject node
   */
  findSubClassesNT(
      subject: Node
  ): {
      [uri: string]: boolean;
  };
  /**
   * Get all the Classes of which we can RDFS-infer the subject is a subclass
   * Returns a hash table where key is NT of type and value is statement why we
   * think so.
   * Does NOT return terms, returns URI strings.
   * We use NT representations in this version because they handle blank nodes.
   * @param subject A subject node
   */
  findSuperClassesNT(
      subject: Node
  ): {
      [uri: string]: boolean;
  };
  /**
   * Get all the Classes of which we can RDFS-infer the subject is a member
   * todo: This will loop is there is a class subclass loop (Sublass loops are
   * not illegal)
   * Returns a hash table where key is NT of type and value is statement why we
   * think so.
   * Does NOT return terms, returns URI strings.
   * We use NT representations in this version because they handle blank nodes.
   * @param subject A subject node
   */
  findTypesNT(
      subject: Node
  ): {
      [uri: string]: boolean;
  };
  /**
   * Get all the Classes of which we can RDFS-infer the subject is a member
   * todo: This will loop is there is a class subclass loop (Sublass loops are
   * not illegal)
   * Returns a hash table where key is NT of type and value is statement why we
   * think so.
   * Does NOT return terms, returns URI strings.
   * We use NT representations in this version because they handle blank nodes.
   * @param subject A subject node
   */
  findTypeURIs(
      subject: Node
  ): {
      [uri: string]: boolean;
  };
  /**
   * Trace the statements which connect directly, or through bnodes
   * Returns an array of statements
   * doc param may be null to search all documents in store
   * @param subject A subject node
   * @param doc A document (the graph that contains statements)
   * @param excludePredicateURIs The predicate URIs to exclude
   */
  connectedStatements(
      subject: Node,
      doc: ValueType,
      excludePredicateURIs: ReadonlyArray<string>
  ): Statement[];
  /**
   * Creates a new empty formula - features not applicable, but necessary for typing to pass
   */
  formula(features?: ReadonlyArray<string>): Formula;
  /**
   * Transforms an NTriples string format into a Node.
   * The bnode bit should not be used on program-external values; designed
   * for internal work such as storing a bnode id in an HTML attribute.
   * This will only parse the strings generated by the vaious toNT() methods.
   * @param str A string representation
   */
  fromNT(str: string): Node;
  /**
   * Gets whether this formula holds the specified statement
   * @param s A subject
   * @param p A predicate
   * @param o An object
   * @param g A containing graph
   */
  holds(
      s?: Node | null,
      p?: Node | null,
      o?: Node | null,
      g?: Node | null
  ): boolean;
  /**
   * Gets whether this formula holds the specified statement
   * @param st A statement
   */
  holdsStatement(st: Statement): boolean;
  /**
   * Gets a collection from a list of values
   * @param values The values
   */
  list(values: Iterable<ValueType>): Collection;
  /**
   * Gets a literal node
   * @param val The literal's lexical value
   * @param lang The language
   * @param dt The datatype as a named node
   */
  literal(val: string, lang: string, dt: NamedNode): Literal;
  /**
   * Transform a collection of NTriple URIs into their URI strings
   * @param t some iterable colletion of NTriple URI strings
   * @return a collection of the URIs as strings
   */
  NTtoURI(t: {
      [uri: string]: any;
  }): {
      [uri: string]: any;
  };
  /**
   * Serializes this formula
   * @param base The base string
   * @param contentType The content type of the syntax to use
   * @param provenance The provenance URI
   */
  serialize(base: string, contentType: string, provenance: string): string;
  /**
   * Gets a new formula with the substituting bindings applied
   * @param bindings The bindings to substitute
   */
  substitute(bindings: Bindings): Formula;
  /**
   * Gets an named node for an URI
   * @param uri The URI
   */
  sym(uri: string | NamedNode): NamedNode;
  /**
   * Gets the node matching the specified pattern
   * @param s The subject
   * @param p The predicate
   * @param o The object
   * @param g The graph that contains the statement
   */
  the(
      s?: Node | null,
      p?: Node | null,
      o?: Node | null,
      g?: Node | null
  ): Node;
  /**
   * RDFS Inference
   * These are hand-written implementations of a backward-chaining reasoner
   * over the RDFS axioms.
   * @param seeds A hash of NTs of classes to start with
   * @param predicate The property to trace though
   * @param inverse Trace inverse direction
   */
  transitiveClosure(
      seeds: {
          [uri: string]: boolean;
      },
      predicate: Node,
      inverse: Node
  ): {
      [uri: string]: boolean;
  };
  /**
   * Finds the types in the list which have no *stored* supertypes
   * We exclude the universal class, owl:Things and rdf:Resource, as it is
   * information-free.
   * @param types The types
   */
  topTypeURIs(types: {
      [id: string]: string | NamedNode;
  }): {
      [id: string]: string | NamedNode;
  };
  /**
   * Gets the number of statements in this formulat that matches the specified pattern
   * @param s The subject
   * @param p The predicate
   * @param o The object
   * @param g The graph that contains the statement
   */
  whether(
      s?: Node | null,
      p?: Node | null,
      o?: Node | null,
      g?: Node | null
  ): number;
  /**
   * Serializes this formulat to a string
   */
  toString(): string;
  /**
   * Gets a namespace for the specified namespace's URI
   * @param nsuri The URI for the namespace
   */
  ns(nsuri: string): (ln: string) => NamedNode;
  /**
   * Gets a new variable
   * @param name The variable's name
   */
  variable(name: string): Variable;
  static termType: string;
}

export class Query {
         pat: IndexedFormula;
         name: string;
         id?: string;
         constructor(name: string, id?: any);
     }

/**
* A formula (set of triples) which indexes by predicate, subject and object.
* It "smushes"  (merges into a single node) things which are identical
* according to owl:sameAs or an owl:InverseFunctionalProperty
* or an owl:FunctionalProperty
*/
export class IndexedFormula extends Formula {
  /**
   * An UpdateManager initialised to this store
   */
  updater?: UpdateManager;
  /**
   * Creates a new formula
   * @param features The list of features to support
   */
  constructor(features: ReadonlyArray<string>);
  /**
   * Dictionary of namespace prefixes
   */
  namespaces: {[key: string]: string};
  /**
   * Gets the URI of the default graph
   */
  static defaultGraphURI(): string;
  /**
   * Gets this graph with the bindings substituted
   * @param bindings The bindings
   */
  substitute(bindings: Bindings): IndexedFormula;

  /**
   * Apply a set of statements to be deleted and to be inserted
   *
   * @param patch The set of statements to be deleted and to be inserted
   * @param target The name of the document to patch
   * @param patchCallback Callback to be called when patching is complete
   */
  applyPatch(
      patch: {
          delete?: ReadonlyArray<Statement>,
          patch?: ReadonlyArray<Statement>
      },
      target: NamedNode,
      patchCallback: () => void
  ): void;

  /**
   * N3 allows for declaring blank nodes, this function enables that support
   *
   * @param x The blank node to be declared, supported in N3
   */
  declareExistential(x: Node): Node;

  /**
   * @param features
   */
  initPropertyActions(features: Array<('sameAs' | 'InverseFunctionalProperty' | 'FunctionalProperty')>): boolean;
  /**
   * Returns the symbol with canonical URI as smushed
   * @param term A RDF node
   */
  canon(term: Node): Node;
  /**
   * Checks this formula for consistency
   */
  check(): void;
  /**
   * Checks a list of statements for consistency
   * @param sts The list of statements to check
   * @param from An index with the array ['subject', 'predicate', 'object', 'why']
   */
  checkStatementList(sts: ReadonlyArray<Statement>, from: number): boolean;
  /**
   * Closes this formula (and return it)
   */
  close(): IndexedFormula;
  /**
   * replaces @template with @target and add appropriate triples
   * removes no triples by default and is a one-direction replication
   * @param template node to copy
   * @param target node to copy to
   * @param flags Whether or not to do a two-directional copy and/or delete triples
   *
   */
  copyTo(
      template: Node,
      target: Node,
      flags?: Array<('two-direction' | 'delete')>
  ): void;
  /**
   * Simplify graph in store when we realize two identifiers are equivalent
   * We replace the bigger with the smaller.
   * @param u1 The first node
   * @param u2 The second node
   */
  equate(u1: Node, u2: Node): boolean;
  /**
   * Creates a new empty indexed formula
   * Only applicable for IndexedFormula, but TypeScript won't allow a subclass to override a property
   * @param features The list of features
   */
  formula(features: ReadonlyArray<string>): IndexedFormula;
  /**
   * The number of statements in this formula
   */
  length: number;
  /**
   * eturns any quads matching the given arguments.
   * Standard RDFJS Taskforce method for Source objects, implemented as an
   * alias to `statementsMatching()`
   * @param subject The subject
   * @param predicate The predicate
   * @param object The object
   * @param graph The graph that contains the statement
   */
  match(
      subject: ValueType,
      predicate: ValueType,
      object: ValueType,
      graph: ValueType
  ): Statement[];
  /**
   * Find out whether a given URI is used as symbol in the formula
   * @param uri The URI to look for
   */
  mentionsURI(uri: string): boolean;
  /**
   * Existentials are BNodes - something exists without naming
   * @param uri An URI
   */
  newExistential(uri: string): Node;

  /**
   * Adds a new property action
   * @param pred the predicate that the function should be triggered on
   * @param action the function that should trigger
   */
  newPropertyAction(pred: Node, action: (store: IndexedFormula, subject: NamedNode, object: NamedNode) => boolean): boolean;
  /**
   * Creates a new universal node
   * Universals are Variables
   * @param uri An URI
   */
  newUniversal(uri: string): Node;
  /**
   * Find an unused id for a file being edited: return a symbol
   * (Note: Slow iff a lot of them -- could be O(log(k)) )
   * @param doc A document named node
   */
  nextSymbol(doc: NamedNode): NamedNode;

  /**
   * Query this store asynchronously, return bindings in callback
   *
   * @param myQuery The query to be run
   * @param callback Function to call when bindings
   * @param dummy OBSOLETE - do not use this
   * @param onDone OBSOLETE - do not use this
   */
  query(
      myQuery: Query,
      callback: (bindings: Bindings) => void,
      dummy?: null,
      onDone?: () => void
  ): void;
  /**
   * Query this store synchronously and return bindings
   *
   * @param myQuery The query to be run
   */
  querySync(myQuery: Query): Bindings[];
  /**
   * Removes a statement from this formula
   * @param st A statement to remove
   */
  remove(st: Statement): IndexedFormula;
  /**
   * Removes all statemnts in a doc
   * @param doc The document
   */
  removeDocument(doc: NamedNode): IndexedFormula;
  /**
   * Remove all statements matching args (within limit) *
   * @param subj The subject
   * @param pred The predicate
   * @param obj The object
   * @param why The graph that contains the statement
   * @param limit The number of statements to remove
   */
  removeMany(
      subj?: Node | null,
      pred?: Node | null,
      obj?: Node | null,
      why?: Node | null,
      limit?: number
  ): void;
  /**
   * Remove all matching statements
   * @param subject The subject
   * @param predicate The predicate
   * @param object The object
   * @param graph The graph that contains the statement
   */
  removeMatches(
      subject?: Node | null,
      predicate?: Node | null,
      object?: Node | null,
      graph?: Node | null
  ): void;
  /**
   * Removes a statement
   * @param st The statement to remove
   */
  removeStatement(st: Statement): Formula;
  /**
   * Removes statements
   * @param sts The statements to remove
   */
  removeStatements(sts: ReadonlyArray<Statement>): Formula;
  /**
   * Return all equivalent URIs by which this is known
   * @param x A named node
   */
  allAliases(x: NamedNode): NamedNode[];
  /**
   * Compare by canonical URI as smushed
   * @param x A named node
   * @param y Another named node
   */
  sameThings(x: NamedNode, y: NamedNode): boolean;
  /**
   * A list of all the URIs by which this thing is known
   * @param term
   */
  uris(term: NamedNode): string[];
}
export namespace DataFactory {
  /**
   * Creates a new blank node
   * @param value The blank node's identifier
   */
  function blankNode(value: string): BlankNode;
  /**
   * Creates a new collection
   * @param elements The initial element
   */
  function collection(elements: ReadonlyArray<ValueType>): Collection;
  /**
   * Gets the default graph
   */
  function defaultGraph(): DefaultGraph;
  /**
   * Creates a new fetcher
   * @param store The store to use
   * @param options The options
   */
  function fetcher(store: Formula, options: any): Fetcher;
  /**
   * Creates a new graph (store)
   */
  function graph(): IndexedFormula;
  /**
   * Creates a new literal node
   * @param val The lexical value
   * @param lang The language
   * @param dt The datatype
   */
  function lit(val: string, lang?: string, dt?: NamedNode): Literal;
  /**
   * Creates a new literal node
   * @param value The lexical value
   * @param languageOrDatatype Either the language or the datatype
   */
  function literal(
      value: string,
      languageOrDatatype?: string | NamedNode
  ): Literal;
  /**
   * Creates a new named node
   * @param value The new named node
   */
  function namedNode(value: string): NamedNode;
  /**
   * Creates a new statement
   * @param subject The subject
   * @param predicate The predicate
   * @param object The object
   * @param graph The containing graph
   */
  function quad(
      subject: Node,
      predicate: Node,
      object: Node,
      graph: Node
  ): Statement;
  /**
   * Creates a new statement
   * @param subject The subject
   * @param predicate The predicate
   * @param object The object
   * @param graph The containing graph
   */
  function st(
      subject: Node,
      predicate: Node,
      object: Node,
      graph: Node
  ): Statement;
  /**
   * Creates a new statement
   * @param subject The subject
   * @param predicate The predicate
   * @param object The object
   */
  function triple(subject: Node, predicate: Node, object: Node): Statement;
  /**
   * Creates a new variable
   * @param name The name for the variable
   */
  function variable(name?: string): Variable;
}
export namespace Util {
  /**
   * Gets a named node for a media type
   * @param mediaType A media type
   */
  function mediaTypeClass(mediaType: string): NamedNode;
  /**
   * Gets a named node from the name of a relation
   * @param relation The name of a relation
   */
  function linkRelationProperty(relation: string): NamedNode;
  /**
   * Loads ontologies of the data we load (this is the callback from the kb to
   * the fetcher). Exports as `AJAR_handleNewTerm`
   * @param kb The store
   * @param p A property
   * @param requestedBy
   */
  function AJAR_handleNewTerm(
      kb: Formula,
      p: NamedNode,
      requestedBy: string
  ): Promise<any>;
}
/**
* A datatype-specific handler for fetching data
*/
export interface Handler {
  response: any;
  dom: any;
}
export interface FetchOptions {
  fetch?: typeof fetch;
  /**
   * The resource which referred to this (for tracking bad links).
   */
  referringTerm?: NamedNode;
  /**
   * Provided content type (for writes).
   */
  contentType?: string;
  /**
   * Override the incoming header to force the data to be treated as this content-type (for reads).
   */
  forceContentType?: string;
  /**
   * Load the data even if loaded before. Also sets the `Cache-Control:` header to `no-cache`.
   */
  force?: boolean;
  /**
   * Original uri to preserve through proxying etc (`xhr.original`).
   */
  baseUri?: Node | string;
  /**
   * Whether this request is a retry via a proxy (generally done from an error handler).
   */
  proxyUsed?: boolean;
  /**
   * Flag for XHR/CORS etc
   */
  withCredentials?: boolean;
  /**
   * Before we parse new data, clear old, but only on status 200 responses.
   */
  clearPreviousData?: boolean;
  /**
   * Prevents the addition of various metadata triples (about the fetch request) to the store.
   */
  noMeta?: boolean;
  noRDFa?: boolean;
}
/**
* Responsible for fetching RDF data
*/
export class Fetcher {
  store: any;
  timeout: number;
  appNode: BlankNode;
  requested: {
      [uri: string]: any;
  };
  timeouts: any;
  redirectedTo: any;
  constructor(store: any, options: any);
  static HANDLERS: {
      RDFXMLHandler: Handler;
      XHTMLHandler: Handler;
      XMLHandler: Handler;
      HTMLHandler: Handler;
      TextHandler: Handler;
      N3Handler: Handler;
  };
  static CONTENT_TYPE_BY_EXT: {
      [ext: string]: string;
  };
  /**
   * Loads a web resource or resources into the store.
   * @param uri Resource to load, provided either as a NamedNode object or a plain URL. If multiple resources are passed as an array, they will be fetched in parallel.
   */
  load: (uri: ReadonlyArray<NamedNode> | ReadonlyArray<string> | NamedNode | string, options?: FetchOptions) => Promise<Response>;
}
/**
* Gets a node for the specified input
* @param value An input value
*/
export function term(value: ValueType): Node | Collection | ValueType;
/**
* Gets a namespace
* @param nsuri The URI for the namespace
*/
export function Namespace(nsuri: string): (ln: string) => NamedNode;
/**
* Transforms an NTriples string format into a Node.
* The bnode bit should not be used on program-external values; designed
* for internal work such as storing a bnode id in an HTML attribute.
* This will only parse the strings generated by the vaious toNT() methods.
* @param str A string representation
*/
export function fromNT(str: string): Node;
/**
* Creates a new fetcher
* @param store The store to use
* @param options The options
*/
export function fetcher(store: Formula, options: any): Fetcher;
/**
* Creates a new graph (store)
*/
export function graph(): IndexedFormula;
/**
* Creates a new literal node
* @param val The lexical value
* @param lang The language
* @param dt The datatype
*/
export function lit(val: string, lang: string, dt: NamedNode): Literal;
/**
* Creates a new statement
* @param subject The subject
* @param predicate The predicate
* @param object The object
* @param graph The containing graph
*/
export function st(
  subject: Node | Date | string,
  predicate: Node,
  object: Node | Date | string,
  graph: Node
): Statement;
/**
* Creates a new named node
* @param value The new named node
*/
export function sym(value: string): NamedNode;
/**
* Creates a new variable
* @param name The name for the variable
*/
export function variable(name: string): Variable;
/**
* Creates a new blank node
* @param value The blank node's identifier
*/
export function blankNode(value: string): BlankNode;
/**
* Gets the default graph
*/
export function defaultGraph(): DefaultGraph;
/**
* Creates a new literal node
* @param value The lexical value
* @param languageOrDatatype Either the language or the datatype
*/
export function literal(
  value: string,
  languageOrDatatype: string | NamedNode
): Literal;
/**
* Creates a new named node
* @param value The new named node
*/
export function namedNode(value: string): NamedNode;
/**
* Creates a new statement
* @param subject The subject
* @param predicate The predicate
* @param object The object
* @param graph The containing graph
*/
export function quad(
  subject: Node,
  predicate: Node,
  object: Node,
  graph: Node
): Statement;
/**
* Creates a new statement
* @param subject The subject
* @param predicate The predicate
* @param object The object
*/
export function triple(subject: Node, predicate: Node, object: Node): Statement;
/**
* Parse a string and put the result into the graph kb.
* Normal method is sync.
* Unfortunately jsdonld is currently written to need to be called async.
* Hence the mess below with executeCallback.
* @param str The input string to parse
* @param kb The store to use
* @param base The base URI to use
* @param contentType The content type for the input
* @param callback The callback to call when the data has been loaded
*/
export function parse(
  str: string,
  kb: Formula,
  base: string,
  contentType: string,
  callback: (error: any, kb: Formula) => void
): void;
/**
* Get the next available unique identifier
*/
export let NextId: number;

/**
* The update manager is a helper object for a store.
* Just as a Fetcher provides the store with the ability to read and write, the Update Manager provides functionality for making small patches in real time,
* and also looking out for concurrent updates from other agents.
*/
export class UpdateManager {
  /**
   * @param store The quadstore to store data and metadata. Created if not passed.
   */
  constructor(store?: IndexedFormula)

  /**
   * This is suitable for an initial creation of a document.
   * @param document
   * @param data
   * @param contentType
   * @param callback
   */
  put(
      document: Node,
      data: string | ReadonlyArray<Statement>,
      contentType: string,
      callback: (uri: string, ok: boolean, errorMessage: string, response?: unknown) => void,
  ): Promise<void>;

  /**
   * This high-level function updates the local store iff the web is changed successfully.
   * Deletions, insertions may be undefined or single statements or lists or formulae (may contain bnodes which can be indirectly identified by a where clause).
   * The `why` property of each statement must be the same and give the web document to be updated.
   * @param statementsToDelete Statement or statements to be deleted.
   * @param statementsToAdd Statement or statements to be inserted.
   * @param callback
   */
  update(
      statementsToDelete: ReadonlyArray<Statement>,
      statementsToAdd: ReadonlyArray<Statement>,
      callback: (uri: string | undefined, success: boolean, errorBody?: string) => void
  ): void;
