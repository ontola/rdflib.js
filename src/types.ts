import Node from './node-internal';
import Variable from './variable';
import BlankNode from './blank-node';
import Collection from './collection';
import Literal from './literal';
import NamedNode from './named-node';

/**
 * Types that support both Enums (for typescript) and regular strings
 */
export type NamedNodeTermType = "NamedNode" | TermType.NamedNode
export type BlankNodeTermType = "BlankNode" | TermType.BlankNode
export type LiteralTermType = "Literal" | TermType.Literal
export type VariableTermType = "Variable" | TermType.Variable
export type CollectionTermType = "Collection" | TermType.Collection
export type DefaultGraphTermType = "DefaultGraph" | TermType.DefaultGraph

export enum TermType {
  NamedNode = "NamedNode",
  BlankNode = "BlankNode",
  Literal = "Literal",
  Variable = "Variable",
  Collection = "Collection",
  DefaultGraph = "DefaultGraph",
}

/**
 * In this project, there exist two types for the same kind of RDF concept.
 * We have RDFJS Taskforce types (standardized, generic), and RDFlib types (internal, specific).
 * When deciding which type to use in a function, it is preferable to accept generic inputs,
 * whenever possible, and provide strict outputs.
 */

/**
 * RDF.js taskforce Term
 * @link https://rdf.js.org/data-model-spec/#term-interface
 */
export interface TFTerm {
  termType: string
  value: string
  equals(other: TFTerm): boolean
}

/**
 * RDF.js taskforce NamedNode
 * @link https://rdf.js.org/data-model-spec/#namednode-interface
 */
export interface TFNamedNode extends TFTerm {
  termType: NamedNodeTermType
  value: string
  equals(other: TFTerm): boolean
}

/**
 * RDF.js taskforce Literal
 * @link https://rdf.js.org/data-model-spec/#literal-interface
 */
export interface TFBlankNode extends TFTerm {
  termType: BlankNodeTermType
  value: string
  equals(other: TFTerm): boolean
};

/**
 * RDF.js taskforce Quad
 * @link https://rdf.js.org/data-model-spec/#quad-interface
 */
export interface TFQuad<
  S extends TFNamedNode | TFBlankNode = TFNamedNode | TFBlankNode,
  P extends TFNamedNode = TFNamedNode,
  O extends TFTerm = TFObject,
  G extends TFNamedNode | TFDefaultGraph = TFNamedNode | TFDefaultGraph
> {
  subject: S
  predicate: P
  object: O
  graph: G
  equals(other: TFQuad): boolean
}

/**
 * RDF.js taskforce Literal
 * @link https://rdf.js.org/data-model-spec/#literal-interface
 */
export interface TFLiteral extends TFTerm {
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
  datatype: TFNamedNode
  equals(other: Literal): boolean
};

/**
 * RDF.js taskforce Variable
 * @link https://rdf.js.org/data-model-spec/#variable-interface
 */
export interface TFVariable extends TFTerm {
  /** Contains the constant "Variable". */
  termType: VariableTermType
  /** The name of the variable without leading "?" (example: "a"). */
  value: string
  /**
   * Returns true if all general Term.equals conditions hold and term.value
   * is the same string as other.value; otherwise, it returns false.
   */
  equals(other: TFTerm): boolean
};

/**
 * An instance of DefaultGraph represents the default graph. It's only allowed to assign a DefaultGraph to the graph property of a Quad.
 */
export interface TFDefaultGraph extends TFTerm {
  termType: string;
  value: '';
  equals(other: TFTerm): boolean
};

export type TFObject = TFNamedNode | TFBlankNode | TFLiteral

/**
* A type for values that serves as inputs
*/
export type ValueType = TFTerm | Node | Date | string | number | boolean | undefined | null | Collection;

export interface Bindings {
  [id: string]: Node;
}

export type SubjectType = TFBlankNode | NamedNode | TFNamedNode | Variable
export type PredicateType = TFNamedNode | NamedNode | Variable
export type ObjectType = TFObject | NamedNode | Literal | Collection | BlankNode | Variable
export type GraphType = TFDefaultGraph | TFNamedNode | NamedNode | Variable
export type SomeNode = NamedNode | BlankNode
