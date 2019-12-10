import { SupportTable } from './factories/factory-types'
import {
  LiteralTermType,
} from './types'
import {
  Variable,
  DefaultGraph,
  NamedNode,
  BlankNode,
  // BaseQuad as Quad,
} from 'rdf-js'
import { Collection } from './index'
export {
  Variable,
  DefaultGraph,
  NamedNode,
  BlankNode,
  // BaseQuad as Quad,
} from 'rdf-js'

/**
 * Parent Interface of all Term types.
 *
 * Differs from rdf-js implementation, because the equals
 * method accepts should also accept Collections,
 * which is a Term that is not present in rdf-js.
 */
export interface Term {
  termType: string
  value: string

  /**
   * Compare this term with {other} for structural equality
   *
   * Note that the task force spec only allows comparison with other terms
   */
  equals (other: any): boolean
}

/**
 * An RDF quad, taking any Term in its positions, containing the subject, predicate, object and graph terms.
 */
export interface Quad {
  /**
   * The subject.
   * @see Quad_Subject
   */
  subject: Quad_Subject;
  /**
   * The predicate.
   * @see Quad_Predicate
   */
  predicate: Quad_Predicate;
  /**
   * The object.
   * @see Quad_Object
   */
  object: Quad_Object | Collection;
  /**
   * The named graph.
   * @see Quad_Graph
   */
  graph: Quad_Graph;

  /**
   * @param other The term to compare with.
   * @return True if and only if the argument is a) of the same type b) has all components equal.
   */
  equals(other: Quad): boolean;
}

/**
 * RDF/JS taskforce Literal
 * @link https://rdf.js.org/data-model-spec/#literal-interface
 */
export interface Literal extends Term {
  /** Contains the constant "Literal". */
  termType: LiteralTermType
  /** The text value, unescaped, without language or type (example: "Brad Pitt") */
  value: string
  /**
   * The language as lowercase BCP-47 [BCP47] string (examples: "en", "en-gb")
   * or an empty string if the literal has no language.
   */
  language: string
  /** A NamedNode whose IRI represents the datatype of the literal. */
  datatype: NamedNode
}

/**
 * RDF/JS taskforce DataFactory
 *
 * Not 100% compliant due to to practicality problems.
 *
 * @link https://rdf.js.org/data-model-spec/#datafactory-interface
 */
export interface TFDataFactory {
  /** Returns a new instance of NamedNode. */
  namedNode: (value: string) => NamedNode,

  /**
   * Returns a new instance of BlankNode.
   * If the value parameter is undefined a new identifier for the
   * blank node is generated for each call.
   */
  blankNode: (value?: string) => BlankNode,

  /**
   * Returns a new instance of Literal.
   * If languageOrDatatype is a NamedNode, then it is used for the value of datatype.
   * Otherwise languageOrDatatype is used for the value of language. */
  literal: (value: string, languageOrDatatype: string | NamedNode) => Literal,

  /** Returns a new instance of Variable. This method is optional. */
  variable?: (value: string) => Variable,

  /**
   * Returns an instance of DefaultGraph.
   */
  defaultGraph: () => DefaultGraph | NamedNode | BlankNode,

  /**
   * Returns a new instance of the specific Term subclass given by original.termType
   * (e.g., NamedNode, BlankNode, Literal, etc.),
   * such that newObject.equals(original) returns true.
   * Not implemented in RDFJS, so optional.
   */
  fromTerm?: (original: Term) => Term

  /**
   * Returns a new instance of Quad, such that newObject.equals(original) returns true.
   * Not implemented in RDFJS, so optional.
   */
  fromQuad?: (original: Quad) => Quad

  /**
   * Returns a new instance of Quad.
   * If graph is undefined or null it MUST set graph to a DefaultGraph.
   */
  quad: (
    subject: Term,
    predicate: Term,
    object: Term,
    graph?: Term,
  ) => Quad

  /**
   * Check for specific features/behaviour on the factory.
   *
   * This does not exist on the original RDF/JS spec
   */
  supports: SupportTable
}

/** A RDF/JS taskforce Subject */
export type Quad_Subject = NamedNode | BlankNode | Variable
/** A RDF/JS taskforce Predicate */
export type Quad_Predicate = NamedNode | Variable
/** A RDF/JS taskforce Object, but with Collections */
export type Quad_Object = NamedNode | BlankNode | Literal | Variable | Collection
/** A RDF/JS taskforce Graph */
export type Quad_Graph = NamedNode | DefaultGraph | BlankNode | Variable
