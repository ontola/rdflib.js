/**
 * The superclass of all RDF Statement objects, that is
 * NamedNode, Literal, BlankNode, etc.
 * Should not be instantiated directly.
 * Also called Term.
 * @link https://rdf.js.org/data-model-spec/#term-interface
 * @class Node
 */
export default class Node {
  static fromValue: <T = unknown>(value: any) => T;
  static toJS: (term: any) => Date | Number | string | boolean | object | Array<Date | Number | string | boolean | object>;

  /**
   * The type of node
   */
  termType!: string;

  /**
   * The class order for this node
   */
  classOrder!: number;

  /**
   * The node's value
   */
  value: string;

  constructor(value: string) {
    this.value = value
  }

  /**
   * Creates the substituted node for this one, according to the specified bindings
   * @param bindings - Bindings of identifiers to nodes
   */
  substitute (bindings): Node | any {
    console.log('@@@ node substitute' + this)
    return this
  }

  /**
   * Compares this node with another
   * @param other - The other node
   */
  compareTerm (other): number {
    if (this.classOrder < other.classOrder) {
      return -1
    }
    if (this.classOrder > other.classOrder) {
      return +1
    }
    if (this.value < other.value) {
      return -1
    }
    if (this.value > other.value) {
      return +1
    }
    return 0
  }

  /**
   * Compares whether the two nodes are equal
   * @param other The other node
   */
  equals (other): boolean {
    if (!other) {
      return false
    }
    return (this.termType === other.termType) &&
      (this.value === other.value)
  }

  /**
   * Creates a hash for this node
   * @deprecated use {rdfFactory.id} instead if possible
   */
  hashString (): string {
    return this.toCanonical()
  }

  /**
   * Compares whether this node is the same as the other one
   * @param other - Another node
   */
  sameTerm (other): boolean {
    return this.equals(other)
  }

  /**
   * Creates a canonical string representation of this node
   */
  toCanonical (): string {
    return this.toNT()
  }

  /**
   * Creates a n-triples string representation of this node
   */
  toNT (): string {
    return this.toString()
  }

  /**
   * Creates a n-quads string representation of this node
   */
  toNQ (): string {
    return this.toNT();
  }

  /**
   * Creates a string representation of this node
   */
  toString (): string {
    throw new Error('Node.toString() is abstract - see the subclasses instead')
  }
}
