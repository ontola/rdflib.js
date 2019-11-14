import BlankNode from './blank-node'
import Literal from './literal'
import NamedNode from './named-node'
import Statement from './statement'
import Variable from './variable'
import {
  TFNamedNode,
  SubjectType,
  PredicateType,
  ObjectType,
  GraphType,
  TermType,
  TFDataFactory,
} from './types'
import { Feature, IdentityFactory, Indexable } from './data-factory-type'
import { Node } from './index'

export const defaultGraphURI = 'chrome:theSession'

/**
 * Creates a new blank node
 * @param value The blank node's identifier
 */
function blankNode(value?: string): BlankNode {
  return new BlankNode(value)
}

/**
 * Gets the default graph
 */
function defaultGraph(): NamedNode {
  return new NamedNode(defaultGraphURI)
}

/**
 * Generates a unique identifier for the object.
 *
 * Equivalent to {Term.hashString}
 */
function id (term: Node): string | undefined {
  if (!term) {
    return term
  }
  if (Object.prototype.hasOwnProperty.call(term, "id") && typeof (term as NamedNode).id === "function") {
    return (term as NamedNode).id()
  }
  if (Object.prototype.hasOwnProperty.call(term, "hashString")) {
    return term.hashString()
  }

  switch (term.termType) {
    case TermType.NamedNode:
      return '<' + term.value + '>'
    case TermType.BlankNode:
      return '_:' + term.value
    case TermType.Literal:
      return Literal.toNT(term as Literal)
    case TermType.Variable:
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
  subject: SubjectType,
  predicate: PredicateType,
  object: ObjectType,
  graph?: GraphType
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

/** The internal RDFlib datafactory, which uses Collections  */
const CanonicalDataFactory: TFDataFactory<
  NamedNode,
  BlankNode,
  Literal,
  SubjectType,
  PredicateType,
  ObjectType,
  GraphType,
  // DefaultGraph is:
  NamedNode | BlankNode,
  Statement
> & IdentityFactory <
  Statement,
  NamedNode | BlankNode | Literal | Variable
> = {
  blankNode,
  defaultGraph,
  literal,
  namedNode,
  quad,
  variable,
  id,
  supports: {
    [Feature.collections]: false,
    [Feature.defaultGraphType]: true,
    [Feature.equalsMethod]: true,
    [Feature.identity]: true,
    [Feature.reversibleIdentity]: false,
    [Feature.variableType]: true,
  }
}

/** Contains the factory methods as defined in the spec, plus id */
export default CanonicalDataFactory
