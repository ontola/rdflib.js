import Collection from './collection'
import CanonicalDataFactory from './data-factory-internal'
import Fetcher from './fetcher'
import Literal from './literal'
import Statement from './statement'
import { ValueType, TFNamedNode, TFSubject, TFPredicate, TFObject, TFGraph } from './types'
import IndexedFormula from './store'
import Formula from './formula'

/**
 * Data factory which also supports Collections
 *
 * Necessary for preventing circular dependencies.
 */
const ExtendedTermFactory = {
  ...CanonicalDataFactory,
  collection,
  id,
  supports: {
    COLLECTIONS: true,
    DEFAULT_GRAPH_TYPE: true,
    EQUALS_METHOD: true,
    NODE_LOOKUP: false,
    VARIABLE_TYPE: true,
  }
}

/** Full RDFLib.js Data Factory */
const DataFactory = {
  ...ExtendedTermFactory,
  fetcher,
  graph,
  lit,
  st,
  triple,
}
export default DataFactory

function id (term) {
  if (!term) {
    return term
  }
  if (Object.prototype.hasOwnProperty.call(term, "id") && typeof term.id === "function") {
    return term.id()
  }
  if (Object.prototype.hasOwnProperty.call(term, "hashString")) {
    return term.hashString()
  }

  if (term.termType === "Collection") {
    Collection.toNT(term)
  }

  return CanonicalDataFactory.id(term)
}
/**
 * Creates a new collection
 * @param elements - The initial element
 */
function collection(elements: ReadonlyArray<ValueType>): Collection {
  return new Collection(elements)
}
/**
 * Creates a new fetcher
 * @param store - The store to use
 * @param options - The options
 */
function fetcher(store: Formula, options: any): Fetcher {
  return new Fetcher(store, options)
}
/**
 * Creates a new graph (store)
 */
function graph (features = undefined, opts = undefined): IndexedFormula {
  return new IndexedFormula(features, opts || { rdfFactory: ExtendedTermFactory })
}
/**
 * Creates a new literal node
 * @param val The lexical value
 * @param lang The language
 * @param dt The datatype
 */
function lit(val: string, lang?: string, dt?: TFNamedNode): Literal {
  return new Literal('' + val, lang, dt)
}
/**
 * Creates a new statement
 * @param subject The subject
 * @param predicate The predicate
 * @param object The object
 * @param graph The containing graph
 */
function st(
  subject: TFSubject,
  predicate: TFPredicate,
  object: TFObject,
  graph?: TFGraph
): Statement;
function st (subject, predicate, object, graph) {
  return new Statement(subject, predicate, object, graph)
}
/**
 * Creates a new statement
 * @param subject The subject
 * @param predicate The predicate
 * @param object The object
 */
function triple(
  subject: TFSubject,
  predicate: TFPredicate,
  object: TFObject
): Statement {
  return CanonicalDataFactory.quad(subject, predicate, object)
}
