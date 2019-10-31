import ClassOrder from './class-order'
import Node from './node-internal'
import { ValueType, TFNamedNode, TermType, NamedNodeTermType } from './types';
import { uriCreator } from './utils';

export function isNamedNode<T>(value: T | Node): value is NamedNode {
  return (value as Node).termType === TermType.NamedNode
}

/**
* A named (IRI) RDF node
*/
export default class NamedNode extends Node implements TFNamedNode {
  static termType: NamedNodeTermType;

  termType: NamedNodeTermType;

  /**
   * Create a named (IRI) RDF Node
   * @param iri The IRI for this node
   */
  constructor (iriIn: TFNamedNode | string) {
    super()
    this.termType = TermType.NamedNode

    const iri = uriCreator(iriIn)

    if (!iri) {
      throw new Error('Missing IRI for NamedNode')
    }

    const iriString = iri as string

    if (!iriString.includes(':')) {
      throw new Error('NamedNode IRI "' + iri + '" must be absolute.')
    }

    if (iriString.includes(' ')) {
      var message = 'Error: NamedNode IRI "' + iri + '" must not contain unencoded spaces.'
      throw new Error(message)
    }

    this.value = iriString
  }

  /**
   * Returns an RDF node for the containing directory, ending in slash.
   */
  dir (): NamedNode | null{
     var str = this.value.split('#')[0]
     var p = str.slice(0, -1).lastIndexOf('/')
     var q = str.indexOf('//')
     if ((q >= 0 && p < q + 2) || p < 0) return null
     return new NamedNode(str.slice(0, p + 1))
   }

  /**
   * Returns a NamedNode for the whole web site, ending in slash.
   * Contrast with the "origin" which does NOT have a trailing slash
   */
  site (): NamedNode {
     var str = this.value.split('#')[0]
     var p = str.indexOf('//')
     if (p < 0) throw new Error('This URI does not have a web site part (origin)')
     var q = str.indexOf('/', p+2)
     if (q < 0) {
       return new NamedNode(str.slice(0) + '/')   // Add slash to a bare origin
     } else {
       return new NamedNode(str.slice(0, q + 1))
     }
   }

  /**
   * Gets the named node for the document
   */
  doc (): NamedNode {
    if (this.uri.indexOf('#') < 0) {
      return this
    } else {
      return new NamedNode(this.uri.split('#')[0])
    }
  }

  /**
   * Returns the URI including <brackets>
   */
  toString (): string {
    return '<' + this.uri + '>'
  }

  /**
   * The local identifier with the document
   */
  id () {
    return this.uri.split('#')[1]
  }

  /**
   * Legacy getter and setter alias, node.uri
   * @deprecated use .value
   */
  get uri (): string {
    return this.value
  }
  set uri (uri: string) {
    this.value = uri
  }

  /**
   * Gets a named node from the specified input value
   * @param value An input value
   */
  static fromValue(value: ValueType): NamedNode | null | undefined | Node {
    if (typeof value === 'undefined' || value === null) {
      return value
    }
    const isNode = value && (value as Node).termType
    if (isNode) {
      return value as NamedNode
    }
    return new NamedNode(value as string)
  }
}
NamedNode.termType = TermType.NamedNode
NamedNode.prototype.classOrder = ClassOrder['NamedNode']
NamedNode.prototype.isVar = false
