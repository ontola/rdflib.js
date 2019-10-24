// This file attaches all functionality to Node
// that would otherwise require circular dependencies.
import Node from './node-internal'
import Collection from './collection'
import Literal from './literal'
import { ValueType, TFTerm } from './types'
import Namespace from './namespace'
import { isTFLiteral } from './literal';
import { isCollection } from './utils'

export default Node

function isTFTerm<T>(value: T | TFTerm): value is TFTerm {
  return Object.prototype.hasOwnProperty.call(value, 'termType')
}

/**
 * Creates an RDF Node from a native javascript value.
 * RDF Nodes are returned unchanged, undefined returned as itself.
 * Arrays return Collections.
 * Strings, numbers and booleans return Literals.
 * @method fromValue
 * @param value - Any native Javascript value
 */

Node.fromValue = function <T extends ValueType>(value: ValueType): T {
  if (typeof value === 'undefined' || value === null) {
    // throw new Error(`Can't make Node from ${typeof value}`)
    return value as T
  }
  if (isTFTerm(value)) {  // a Node subclass or a Collection
    return value as T
  }
  if (Array.isArray(value)) {
    return new Collection(value) as T
  }
  return Literal.fromValue(value) as T
}

const ns = { xsd: Namespace('http://www.w3.org/2001/XMLSchema#') }

/**
 * Gets the javascript object equivalent to a node
 * @param term The RDF node
 */
Node.toJS = function (term: TFTerm): TFTerm | boolean | number | Date | string | any[] {
  if (isCollection(term)) {
    return term.elements.map(Node.toJS) // Array node (not standard RDFJS)
  }
  if (!isTFLiteral(term)) return term
  if (term.datatype.equals(ns.xsd('boolean'))) {
    return term.value === '1'
  }
  if (term.datatype.equals(ns.xsd('dateTime')) ||
    term.datatype.equals(ns.xsd('date'))) {
    return new Date(term.value)
  }
  if (
    term.datatype.equals(ns.xsd('integer')) ||
    term.datatype.equals(ns.xsd('float')) ||
    term.datatype.equals(ns.xsd('decimal'))
  ) {
    let z = Number(term.value)
    return Number(term.value)
  }
  return term.value
}
