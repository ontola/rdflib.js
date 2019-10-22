import BlankNode from './blank-node'
import ClassOrder from './class-order'
import Node from './node-internal'
import { ValueType, Bindings, TFTerm, CollectionTermType, TermType } from './types';

export function isCollection<T>(value: T | TFTerm): value is Collection {
  return (value as Node).termType === 'Collection'
}

/**
* A collection of other RDF nodes
*/
export default class Collection extends Node {

  static termType: CollectionTermType;

  /**
   * The identifier for this collection
   */
  id: number;

  /**
   * The nodes in this collection
   */

   elements: Node[];

  /**
   * Whether this collection is closed
   */
  closed: boolean;

  /**
   * Initializes this collection
   * @param initial The initial elements
   */
  constructor(initial?: ReadonlyArray<ValueType>) {
    super()
    this.termType = Collection.termType
    this.id = BlankNode.nextId++
    this.elements = []
    this.closed = false
    if (initial && initial.length > 0) {
      initial.forEach(element => {
        this.elements.push(Node.fromValue(element) as Node)
      })
    }
  }

  /**
   * Appends an element to this collection
   * @param element The new element
   */
  append (element: Node): number {
    return this.elements.push(element)
  }

  /**
   * Closes this collection
   */
  close (): boolean {
    this.closed = true
    return this.closed
  }

  /**
   * Removes the first element from the collection (and return it)
   */
  shift (): Node | undefined {
    return this.elements.shift()
  }

  /**
   * Gets a new Collection with the substituting bindings applied
   * @param bindings The bindings to substitute
   */
  substitute(bindings: Bindings): Collection {
    var elementsCopy = this.elements.map(function (ea) {
      ea.substitute(bindings)
    })
    return new Collection(elementsCopy as [])
  }
  toNT () {
    return Collection.toNT(this)
  }
  static toNT (collection) {
    return BlankNode.NTAnonymousNodePrefix + collection.id
  }

  /**
   * Serializes the collection to a string.
   * Surounded by (parantheses) and seperated by spaces.
   */
  toString () {
    return '(' + this.elements.join(' ') + ')'
  }

  /**
   * Preprends the specified element to the colelction's front
   * @param element The element to preprend
   */
  unshift (element: Node): number {
    return this.elements.unshift(element)
  }
}
Collection.termType = TermType.Collection
Collection.prototype.classOrder = ClassOrder['Collection']
Collection.prototype.compareTerm = BlankNode.prototype.compareTerm
Collection.prototype.isVar = false
