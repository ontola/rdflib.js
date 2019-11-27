import NamedNode from './named-node'
import Node from './node-internal'
import XSD from './xsd-internal'
import { ValueType, TFTerm, LiteralTermType, TFLiteral, TFNamedNode, TermType } from './types'
import classOrder from './class-order'
import { isNamedNode } from './utils'

export function isTFLiteral<T>(value: T | TFTerm): value is TFLiteral {
  return (value as TFTerm).termType === TermType.Literal
}

/**
 * An RDF literal node, containing something different than a URI.
 * @link https://rdf.js.org/data-model-spec/#literal-interface
 */
// @ts-ignore Incorrectly extends due to fromValue()
export default class Literal extends Node implements TFLiteral {

  termType: LiteralTermType

  /**
   * The language for the literal
   */
  lang: string

  /**
   * The literal's datatype as a named node
   */
  datatype: NamedNode

  /**
   * Initializes this literal
   * @param value The literal's lexical value
   * @param language The language for the literal. Defaults to ''.
   * @param datatype The literal's datatype as a named node. Defaults to xsd:string.
   */
  constructor (value: string, language?: string | null, datatype?: TFNamedNode) {
    super()
    this.termType = TermType.Literal
    this.value = value
    if (language) {
      this.lang = language
      this.datatype = XSD.langString
    } else {
      this.lang = ''
      this.datatype = XSD.string
    }
    // If not specified, a literal has the implied XSD.string default datatype
    if (datatype) {
      if (isNamedNode(datatype)) {
        this.datatype = datatype
      }
      this.datatype = NamedNode.fromValue(datatype) as NamedNode
    }
  }

  /**
   * Gets a copy of this literal
   */
  copy (): Literal {
    return new Literal(this.value, this.lang, this.datatype)
  }

  /**
   * Gets whether two literals are the same
   * @param other The other statement
   */
  equals (other: TFTerm): boolean {
    if (!other) {
      return false
    }

    return (this.termType === other.termType) &&
      (this.value === other.value) &&
      (this.language === (other as Literal).language) &&
      ((!this.datatype && !(other as Literal).datatype) ||
        (this.datatype && this.datatype.equals((other as Literal).datatype)))
  }

  /**
   * The language for the literal
   */
  get language (): string {
    return this.lang
  }
  set language (language) {
    this.lang = language || ''
  }
  toNT() {
    return Literal.toNT(this)
  }
  /** Serializes a literal to an N-Triples string */
  static toNT (literal: Literal): string {
    if (typeof literal.value === 'number') {
      return '' + literal.value
    } else if (typeof literal.value !== 'string') {
      throw new Error('Value of RDF literal is not string or number: ' +
        literal.value)
    }
    var str = literal.value
    str = str.replace(/\\/g, '\\\\')
    str = str.replace(/\"/g, '\\"')
    str = str.replace(/\n/g, '\\n')
    str = '"' + str + '"'

    if (literal.language) {
      str += '@' + literal.language
    } else if (!literal.datatype.equals(XSD.string)) {
      // Only add datatype if it's not a string
      str += '^^' + literal.datatype.toCanonical()
    }
    return str
  }
  toString () {
    return '' + this.value
  }

  /**
   * Builds a literal node from a boolean value
   * @param value The value
   */
  static fromBoolean(value: boolean): Literal {
    let strValue = value ? '1' : '0'
    return new Literal(strValue, null, XSD.boolean)
  }

  /**
   * Builds a literal node from a date value
   * @param value The value
   */
  static fromDate(value: Date): Literal {
    if (!(value instanceof Date)) {
      throw new TypeError('Invalid argument to Literal.fromDate()')
    }
    let d2 = function (x) {
      return ('' + (100 + x)).slice(1, 3)
    }
    let date = '' + value.getUTCFullYear() + '-' + d2(value.getUTCMonth() + 1) +
      '-' + d2(value.getUTCDate()) + 'T' + d2(value.getUTCHours()) + ':' +
      d2(value.getUTCMinutes()) + ':' + d2(value.getUTCSeconds()) + 'Z'
    return new Literal(date, null, XSD.dateTime)
  }

  /**
   * Builds a literal node from a number value
   * @param value The value
   */
  static fromNumber(value: number): Literal {
    if (typeof value !== 'number') {
      throw new TypeError('Invalid argument to Literal.fromNumber()')
    }
    let datatype: TFNamedNode
    const strValue = value.toString()
    if (strValue.indexOf('e') < 0 && Math.abs(value) <= Number.MAX_SAFE_INTEGER) {
      datatype = Number.isInteger(value) ? XSD.integer : XSD.decimal
    } else {
      datatype = XSD.double
    }
    return new Literal(strValue, null, datatype)
  }

  /**
   * Builds a literal node from an input value
   * @param value The input value
   */
  static fromValue<T extends Literal>(value: ValueType): T {
    if (isTFLiteral(value)) {
      return value as T
    }
    switch (typeof value) {
      case 'object':
        if (value instanceof Date) {
          return Literal.fromDate(value) as T
        }
      case 'boolean':
        return Literal.fromBoolean(value as boolean) as T
      case 'number':
        return Literal.fromNumber(value as number) as T
      case 'string':
        return new Literal(value) as T
    }
    throw new Error("Can't make literal from " + value + ' of type ' +
      typeof value)
  }
}

Literal.prototype.classOrder = classOrder['Literal']
Literal.prototype.lang = ''
Literal.prototype.isVar = false
