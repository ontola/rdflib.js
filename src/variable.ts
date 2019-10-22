import ClassOrder from './class-order'
import Node from './node'
import * as Uri from './uri'
import { TermType } from './types'

/**
* Variables are placeholders used in patterns to be matched.
* In cwm they are symbols which are the formula's list of quantified variables.
* In sparql they are not visibly URIs.  Here we compromise, by having
* a common special base URI for variables. Their names are uris,
* but the ? notation has an implicit base uri of 'varid:'
*/
export default class Variable extends Node {
  termType: TermType.Variable
  static termType: TermType.Variable

  /**
   * The base string for a variable's name
   */
  base: string;
  /**
   * The unique identifier of this variable
   */
  uri: string;
  /**
   * Initializes this variable
   * @param name The variable's name
   */
  constructor (name: string = '') {
    super()
    this.termType = TermType.Variable
    this.value = name
    this.base = 'varid:'
    this.uri = Uri.join(name, this.base)
  }
  equals (other) {
    if (!other) {
      return false
    }
    return (this.termType === other.termType) && (this.value === other.value)
  }
  hashString () {
    return this.toString()
  }
  substitute (bindings) {
    var ref
    return (ref = bindings[this.toNT()]) != null ? ref : this
  }
  toString () {
    return Variable.toString(this)
  }
  static toString (variable) {
    if (variable.uri.slice(0, variable.base.length) === variable.base) {
      return '?' + variable.uri.slice(variable.base.length)
    }
    return '?' + variable.uri
  }
}

Variable.termType = TermType.Variable
Variable.prototype.classOrder = ClassOrder['Variable']
Variable.prototype.isVar = true
