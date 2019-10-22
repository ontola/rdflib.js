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

export type SomeTerm = RDFJSNamedNode | RDFJSBlankNode | RDFJSLiteral

/**
 * RDF.js taskforce Term
 * @link https://rdf.js.org/data-model-spec/#term-interface
 */
export interface Term {
  termType: string
  value: string
  equals(other: Term): boolean
}

/**
 * RDF.js taskforce NamedNode
 * @link https://rdf.js.org/data-model-spec/#namednode-interface
 */
export interface RDFJSNamedNode extends Term {
  termType: NamedNodeTermType
  value: string
  equals(other: Term): boolean
}

/**
 * RDF.js taskforce Literal
 * @link https://rdf.js.org/data-model-spec/#literal-interface
 */
export interface RDFJSBlankNode extends Term {
  termType: BlankNodeTermType
  value: string
  equals(other: Term): boolean
};

/**
 * RDF.js taskforce Quad
 * @link https://rdf.js.org/data-model-spec/#quad-interface
 */
export interface RDFJSQuad<
  S extends RDFJSNamedNode | RDFJSBlankNode = RDFJSNamedNode | RDFJSBlankNode,
  P extends RDFJSNamedNode = RDFJSNamedNode,
  O extends Term = SomeTerm,
  G extends RDFJSNamedNode | DefaultGraph = RDFJSNamedNode | DefaultGraph
> {
  subject: S
  predicate: P
  object: O
  graph: G
  equals(other: RDFJSQuad): boolean
}

/**
 * RDF.js taskforce Literal
 * @link https://rdf.js.org/data-model-spec/#literal-interface
 */
export interface RDFJSLiteral extends Term {
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
  datatype: RDFJSNamedNode
  equals(other: Literal): boolean
};

/**
 * RDF.js taskforce Variable
 * @link https://rdf.js.org/data-model-spec/#variable-interface
 */
export interface RDFJSVariable extends Term {
  /** Contains the constant "Variable". */
  termType: VariableTermType
  /** The name of the variable without leading "?" (example: "a"). */
  value: string
  /**
   * Returns true if all general Term.equals conditions hold and term.value
   * is the same string as other.value; otherwise, it returns false.
   */
  equals(other: Term): boolean
};

/**
 * An instance of DefaultGraph represents the default graph. It's only allowed to assign a DefaultGraph to the graph property of a Quad.
 */
export interface RDFJSDefaultGraph extends Term {
  termType: string;
  value: '';
  equals(other: Term): boolean
};

/**
* A type for values that serves as inputs
*/
export type ValueType = RDFJSNamedNode | Node | Date | string | number | boolean | undefined | null;

export interface Bindings {
  [id: string]: Node;
}

export type SubjectType = NamedNode | RDFJSNamedNode | Variable | RDFJSBlankNode
export type PredicateType = NamedNode | RDFJSNamedNode | Variable
export type ObjectType = NamedNode | RDFJSNamedNode | Literal | Collection | BlankNode | Variable
export type GraphType = NamedNode | RDFJSNamedNode | DefaultGraph | Variable
