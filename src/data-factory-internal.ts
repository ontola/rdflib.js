import BlankNode from './blank-node'
import Literal from './literal'
import NamedNode from './named-node'
import Statement from './statement'
import Variable from './variable'
import { TFSubject, TFPredicate, TFObject, TFGraph, TFNamedNode } from './types'

export const defaultGraphURI = 'chrome:theSession'

/**
 * Creates a new blank node
 * @param value The blank node's identifier
 */
function blankNode(value: string): BlankNode {
  return new BlankNode(value)
}

/**
 * Gets the default graph
 */
function defaultGraph(): TFNamedNode {
  return new NamedNode(defaultGraphURI)
}

/**
 * Generates a unique identifier for the object.
 *
 * Equivalent to {Term.hashString}
 */
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

  switch (term.termType) {
    case "NamedNode":
      return '<' + term.value + '>'
    case "BlankNode":
      return '_:' + term.value
    case "Literal":
      return Literal.toNT(term)
    case "Variable":
      return Variable.toString(term)
    default:
      return undefined
  }
}

/**
 * Creates a new literal node
 * @param value The lexical value
 * @param languageOrDatatype Either the language or the datatype
 */
function literal(
  value: string,
  languageOrDatatype?: string | TFNamedNode
): Literal {
  if (typeof value !== "string" && !languageOrDatatype) {
    return Literal.fromValue(value) as Literal
  }

  const strValue = typeof value === 'string' ? value : '' + value
  if (typeof languageOrDatatype === 'string') {
    if (languageOrDatatype.indexOf(':') === -1) {
      return new Literal(strValue, languageOrDatatype)
    } else {
      return new Literal(strValue, null, namedNode(languageOrDatatype))
    }
  } else {
    return new Literal(strValue, null, languageOrDatatype)
  }
}

/**
 * Creates a new named node
 * @param value The new named node
 */
function namedNode(value: string): NamedNode {
  return new NamedNode(value)
}

/**
* Creates a new statement
* @param subject The subject
* @param predicate The predicate
* @param object The object
* @param graph The containing graph
*/
function quad(
  subject: TFSubject,
  predicate: TFPredicate,
  object: TFObject,
  graph?: TFGraph
): Statement {
  graph = graph || defaultGraph()
  return new Statement(subject, predicate, object, graph)
}

/**
 * Creates a new variable
 * @param name The name for the variable
 */
function variable(name?: string): Variable {
  return new Variable(name)
}

/** Contains the factory methods as defined in the spec, plus id */
export default {
  blankNode,
  defaultGraph,
  literal,
  namedNode,
  quad,
  variable,
  id,
  supports: {
    COLLECTIONS: false,
    DEFAULT_GRAPH_TYPE: true,
    EQUALS_METHOD: true,
    NODE_LOOKUP: false,
    VARIABLE_TYPE: true,
  }
}
