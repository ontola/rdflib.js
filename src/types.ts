import Node from './node-internal';
import Variable from './variable';
import BlankNode from './blank-node';
import Collection from './collection';
import Literal from './literal';
import NamedNode from './named-node';
import { TFNamedNode } from './types';
import DefaultGraph from './default-graph';

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
  DefaultGraph = "DefaultGraph",
  // The next ones are not specified by the rdf.js taskforce
  Collection = "Collection",
  Graph = "Graph",
}

/**
 * In this project, there exist two types for the same kind of RDF concept.
 * We have RDFJS Taskforce types (standardized, generic), and RDFlib types (internal, specific).
 * When deciding which type to use in a function, it is preferable to accept generic inputs,
 * whenever possible, and provide strict outputs.
 * In some ways, the TF types in here are a bit more strict.
 * Variables are missing, and the statement requires specific types of terms (e.g. NamedNode instead of Term).
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
  S extends TFSubject = TFSubject,
  P extends TFPredicate = TFPredicate,
  O extends TFObject = TFObject,
  G extends TFGraph = TFGraph
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
  equals(other: TFTerm): boolean
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
 * RDF.js taskforce DefaultGraph
 * An instance of DefaultGraph represents the default graph.
 * It's only allowed to assign a DefaultGraph to the graph property of a Quad.
 * @link https://rdf.js.org/data-model-spec/#defaultgraph-interface
 */
export interface TFDefaultGraph extends TFTerm {
  termType: DefaultGraphTermType;
  value: '';
  equals(other: TFTerm): boolean
};

/**
 * RDF.js taskforce DataFactory
 * @link https://rdf.js.org/data-model-spec/#datafactory-interface
 */
export interface TFDataFactory {
  /** Returns a new instance of NamedNode. */
  namedNode: (value: string) => TFNamedNode,
  /**
   * Returns a new instance of BlankNode.
   * If the value parameter is undefined a new identifier for the
   * blank node is generated for each call.
   */
  blankNode: (value?: string) => TFBlankNode,
  /**
   * Returns a new instance of Literal.
   * If languageOrDatatype is a NamedNode, then it is used for the value of datatype.
   * Otherwise languageOrDatatype is used for the value of language. */
  literal: (value: string, languageOrDatatype: string | TFNamedNode) => TFLiteral,
  /** Returns a new instance of Variable. This method is optional. */
  variable?: (value: string) => TFVariable,
  /** Returns an instance of DefaultGraph. */
  defaultGraph: () => TFDefaultGraph,
  /**
   * Returns a new instance of the specific Term subclass given by original.termType
   * (e.g., NamedNode, BlankNode, Literal, etc.),
   * such that newObject.equals(original) returns true.
   */
  fromTerm: (original: TFTerm) => TFTerm
  /**
   * Returns a new instance of Quad, such that newObject.equals(original) returns true.
   */
  fromQuad: (original: TFQuad) => TFQuad
}

/**
* A type for values that serves as inputs
*/
export type ValueType = TFTerm | Node | Date | string | number | boolean | undefined | null | Collection;

export interface Bindings {
  [id: string]: TFTerm;
}

export type TFSomeNode = TFBlankNode | TFNamedNode
export type SomeNode = NamedNode | BlankNode

/** A set of allowable input types for statements and related methods. */

export type TFSubject = TFNamedNode | TFBlankNode
export type TFPredicate = TFNamedNode
export type TFObject = TFNamedNode | TFBlankNode | TFLiteral
export type TFGraph = TFNamedNode | TFDefaultGraph

/** RDFJS types */

export type SubjectType = NamedNode | Literal | Variable
export type PredicateType = NamedNode | Variable
export type ObjectType = NamedNode | Literal | Collection | BlankNode | Variable
export type GraphType = DefaultGraph | NamedNode | Variable
