import { Bindings, SubjectType, PredicateType, ObjectType, GraphType, RDFJSQuad } from './types'
import Literal from './literal'
import Node from './node-internal'
import { NamedNode, Collection } from './index';
import BlankNode from './blank-node';
import Variable from './variable';

type StObjectType = NamedNode | Literal | Collection | BlankNode | Variable

/** A Statement represents an RDF Triple or Quad. */
export default class Statement implements RDFJSQuad<Node, NamedNode, StObjectType, NamedNode> {
  /** The subject of the triple.  What the Statement is about. */
  subject: Node

  /** The relationship which is asserted between the subject and object */
  predicate: NamedNode

  /** The thing or data value which is asserted to be related to the subject */
  object: StObjectType

  /**
   * The why param is a named node of the document in which the triple when
   *  it is stored on the web.
   */
  why: GraphType

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
    why?: GraphType,
  ) {
    this.subject = Node.fromValue(subject) as Node
    this.predicate = Node.fromValue(predicate) as NamedNode
    this.object = Node.fromValue(object) as StObjectType
    this.why = why as GraphType  // property currently used by rdflib
  }

  /**
   * The graph param is a named node of the document in which the triple is stored on the web.
   */
  get graph (): GraphType {
    return this.why
  }

  set graph (g) {
    this.why = g
  }

  /**
   * Gets whether two statements are the same
   * @param other The other statement
   */
  equals (other: RDFJSQuad): boolean {
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
      this.object.substitute(bindings) as NamedNode,
      this.why.substitute(bindings)) // 2016
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
    if (this.graph && this.graph.termType !== 'DefaultGraph') {
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
