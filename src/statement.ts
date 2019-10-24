import {
  Bindings,
  GraphType,
  ObjectType,
  PredicateType,
  SubjectType,
  TermType,
  TFQuad,
} from './types'
import Literal from './literal'
import Node from './node-internal'
import { NamedNode, defaultGraph } from './index';

/** A Statement represents an RDF Triple or Quad. */
export default class Statement implements TFQuad<SubjectType, PredicateType, ObjectType, GraphType> {
  /** The subject of the triple.  What the Statement is about. */
  subject: SubjectType

  /** The relationship which is asserted between the subject and object */
  predicate: PredicateType

  /** The thing or data value which is asserted to be related to the subject */
  object: ObjectType

  /**
   * The why param is a named node of the document in which the triple when
   *  it is stored on the web.
   */
  graph: GraphType

  /**
   * Construct a new Triple Statment
   *
   * @param subject - The subject of the triple. What the Statement is about.
   * @param predicate - The relationship which is asserted between the subject and object.
   * @param object - The thing or data value which is asserted to be related to the subject.
   * @param why - The document where the triple is or was or will be stored on the web.
   *   The why param is a named node of the document in which the triple when
   *   it is stored on the web.
   *   It is called “why” because when you have read data from varou slaces the
   *    “why” tells you why you have the triple. (At the moment, it is just the
   *   document, in future it could be an inference step). When you do
   *   UpdateManager.update() then the why’s of all the statmemts must be the same,
   *   and give the document you are patching. In future, we may have a more
   *   powerful update() which can update more than one docment.
  */
  constructor (
    subject: SubjectType,
    predicate: PredicateType,
    object: ObjectType,
    graph?: GraphType,
  ) {
    this.subject = Node.fromValue(subject)
    this.predicate = Node.fromValue(predicate)
    this.object = Node.fromValue(object)
    this.graph = graph as NamedNode  // property currently used by rdflib
    if (graph == undefined) {
      this.graph = defaultGraph() as GraphType
    }
  }

  /**
   * The graph param is a named node of the document in which the triple is stored on the web.
   */
  get why () {
    return this.graph
  }

  set why (g) {
    this.graph = g
  }

  /**
   * Gets whether two statements are the same
   * @param other The other statement
   */
  equals (other: TFQuad): boolean {
    return (
      other.subject.equals(this.subject) &&
      other.predicate.equals(this.predicate) &&
      other.object.equals(this.object as Literal) &&
      other.graph.equals(this.graph)
    )
  }

  /**
   * Gets this statement with the bindings substituted
   * @param bindings The bindings
   */
  substitute (bindings: Bindings): Statement {
    const y = new Statement(
      this.subject.substitute(bindings),
      this.predicate.substitute(bindings),
      this.object.substitute(bindings),
      this.why.substitute<GraphType>(bindings)
    ) // 2016
    console.log('@@@ statement substitute:' + y)
    return y
  }

  /**
   * Gets the canonical string representation of this statement
   */
  toCanonical (): string {
    let terms = [
      this.subject.toCanonical(),
      this.predicate.toCanonical(),
      this.object.toCanonical()
    ]
    if (this.graph && this.graph.termType !== TermType.DefaultGraph) {
        terms.push(this.graph.toCanonical())
    }
    return terms.join(' ') + ' .'
  }

  /**
   * Gets the n-triples string representation of this statement
   */
  toNT (): string {
    return [this.subject.toNT(), this.predicate.toNT(),
      this.object.toNT()].join(' ') + ' .'
  }

  /**
   * Gets the string representation of this statement
   */
  toString (): string {
    return this.toNT()
  }
}
