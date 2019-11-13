
import Fetcher from './fetcher';
import { TFDataFactory, TFTerm, TFQuad, TFNamedNode, TFSubject, TermType, TFLiteral, TFPredicate, TFObject, TFGraph, ObjectType, TFBlankNode } from './types';
import { IndexedFormula, NamedNode, Statement } from './index';
import { docpart } from './uri';
import { string_startswith } from './util';
import log from './log';
import Collection from './collection';

/** RDFLib Typeguards */

/** TypeGuard for RDFLIB Statements */
export function isStatement(obj: any): obj is Statement {
  return obj && obj instanceof Statement
}

// TODO: this should only return true for actual RDFJS NamedNodes
export function isNamedNode<T>(value: T | TFTerm): value is NamedNode {
  return (value as TFTerm).termType === TermType.NamedNode
}

/** TypeGuard for RDFLib Collections */
export function isCollection<T>(obj: T | TFTerm): obj is Collection {
  return obj && Object.prototype.hasOwnProperty.call(obj, "termType")
    && (obj as TFTerm).termType === TermType.Collection
}

/** TypeGuard for valid RDFlib Object types, also allows Collections */
export function isRDFObject(obj: any): obj is ObjectType {
  return obj && Object.prototype.hasOwnProperty.call(obj, "termType") && (
    obj.termType === TermType.NamedNode ||
    obj.termType === TermType.Variable ||
    obj.termType === TermType.BlankNode ||
    obj.termType === TermType.Collection ||
    obj.termType === TermType.Literal
  )
}

/** RDF/JS Taskforce Typeguards */

/** TypeGuard for RDF/JS TaskForce Terms */
export function isTFTerm(obj: any): obj is TFTerm {
  return obj && Object.prototype.hasOwnProperty.call(obj, "termType")
}

/** TypeGuard for RDF/JS TaskForce Literals */
export function isTFLiteral(value: any): value is TFLiteral {
  return (value as TFTerm).termType === TermType.Literal
}

/** TypeGuard for RDF/JS TaskForce Quads */
export function isTFStatement(obj: any): obj is TFQuad {
  return obj && Object.prototype.hasOwnProperty.call(obj, "subject")
}

/** TypeGuard for RDF/JS TaskForce Stores */
export function isStore(obj: any): obj is IndexedFormula {
  return obj && Object.prototype.hasOwnProperty.call(obj, "statements")
}

/** TypeGuard for RDF/JS TaskForce NamedNodes */
export function isTFNamedNode(obj: any): obj is TFNamedNode {
  return obj && Object.prototype.hasOwnProperty.call(obj, "termType") && obj.termType === "NamedNode"
}

/** TypeGuard for RDF/JS TaskForce BlankNodes */
export function isTFBlankNode(obj: any): obj is TFBlankNode {
  return obj && Object.prototype.hasOwnProperty.call(obj, "termType") && obj.termType === "BlankNode"
}

/** TypeGuard for valid RDFJS Taskforce Subject types */
export function isTFSubject(obj: any): obj is TFSubject {
  return obj && Object.prototype.hasOwnProperty.call(obj, "termType") && (
    obj.termType === TermType.NamedNode ||
    obj.termType === TermType.Variable ||
    obj.termType === TermType.BlankNode
  )
}

/** TypeGuard for valid RDFJS Taskforce Predicate types */
export function isTFPredicate(obj: any): obj is TFPredicate {
  return obj && Object.prototype.hasOwnProperty.call(obj, "termType") && (
    obj.termType === TermType.NamedNode ||
    obj.termType === TermType.Variable
  )
}

/** TypeGuard for valid RDFJS Taskforce Object types */
export function isTFObject(obj: any): obj is TFObject {
  return obj && Object.prototype.hasOwnProperty.call(obj, "termType") && (
    obj.termType === TermType.NamedNode ||
    obj.termType === TermType.Variable ||
    obj.termType === TermType.BlankNode ||
    obj.termType === TermType.Literal
  )
}

/** TypeGuard for valid RDFJS Graph types */
export function isTFGraph(obj: any): obj is TFGraph {
  return obj && Object.prototype.hasOwnProperty.call(obj, "termType") && (
    obj.termType === TermType.NamedNode ||
    obj.termType === TermType.Variable ||
    obj.termType === TermType.BlankNode ||
    obj.termType === TermType.DefaultGraph
  )
}

/** Converts NamedNodes to URI strings */
export function uriCreator(input: TFNamedNode | string): string {
  if (isTFNamedNode(input)) {
    return input.value
  }
  return input
}

/**
 * Loads ontologies of the data we load (this is the callback from the kb to
 * the fetcher).
 */
export function AJAR_handleNewTerm (kb: { fetcher: Fetcher }, p, requestedBy) {
  var sf: Fetcher | null = null
  if (typeof kb.fetcher !== 'undefined') {
    sf = kb.fetcher
  } else {
    return
  }
  if (p.termType !== 'NamedNode') return
  var docuri = docpart(p.uri)
  var fixuri
  if (p.uri.indexOf('#') < 0) { // No hash
    // @@ major hack for dbpedia Categories, which spread indefinitely
    if (string_startswith(p.uri, 'http://dbpedia.org/resource/Category:')) return

    /*
      if (string_startswith(p.uri, 'http://xmlns.com/foaf/0.1/')) {
      fixuri = "http://dig.csail.mit.edu/2005/ajar/ajaw/test/foaf"
      // should give HTTP 303 to ontology -- now is :-)
      } else
    */
    if (string_startswith(p.uri,
            'http://purl.org/dc/elements/1.1/') ||
          string_startswith(p.uri, 'http://purl.org/dc/terms/')) {
      fixuri = 'http://dublincore.org/2005/06/13/dcq'
    // dc fetched multiple times
    } else if (string_startswith(p.uri, 'http://xmlns.com/wot/0.1/')) {
      fixuri = 'http://xmlns.com/wot/0.1/index.rdf'
    } else if (string_startswith(p.uri, 'http://web.resource.org/cc/')) {
      //            log.warn("creative commons links to html instead of rdf. doesn't seem to content-negotiate.")
      fixuri = 'http://web.resource.org/cc/schema.rdf'
    }
  }
  if (fixuri) {
    docuri = fixuri
  }
  if (sf && (sf as Fetcher).getState(docuri) !== 'unrequested') return

  if (fixuri) { // only give warning once: else happens too often
    log.warn('Assuming server still broken, faking redirect of <' + p.uri +
      '> to <' + docuri + '>')
  }

  return (sf as any).fetch(docuri, { referringTerm: requestedBy })
}

export const appliedFactoryMethods = [
  'blankNode',
  'defaultGraph',
  'literal',
  'namedNode',
  'quad',
  'variable',
  'supports',
]

const rdf = {
  first: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#first',
  rest: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#rest',
  nil: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#nil'
}

/**
 * Expands an array of Terms to a set of statements representing the rdf:list.
 * @param rdfFactory - The factory to use
 * @param subject - The iri of the first list item.
 * @param data - The terms to expand into the list.
 * @return The {data} as a set of statements.
 */
export function arrayToStatements(
  rdfFactory: TFDataFactory,
  subject: TFSubject,
  data: TFTerm[]
): TFQuad[] {
  const statements: TFQuad[] = []

  data.reduce<TFSubject>((id, _listObj, i, listData) => {
    statements.push(rdfFactory.quad(id, rdfFactory.namedNode(rdf.first), listData[i] as TFLiteral))

    let nextNode
    if (i < listData.length - 1) {
      nextNode = rdfFactory.blankNode()
      statements.push(rdfFactory.quad(id, rdfFactory.namedNode(rdf.rest), nextNode))
    } else {
      statements.push(rdfFactory.quad(id, rdfFactory.namedNode(rdf.rest), rdfFactory.namedNode(rdf.nil)))
    }

    return nextNode
  }, subject)

  return statements
}

export function ArrayIndexOf (arr, item, i: number = 0) {
  var length = arr.length
  if (i < 0) i = length + i
  for (; i < length; i++) {
    if (arr[i] === item) {
      return i
    }
  }
  return -1
}
