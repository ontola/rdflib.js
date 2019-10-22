import Node from './node-internal'
import { RDFJSDefaultGraph } from './types';

export default class DefaultGraph extends Node implements RDFJSDefaultGraph {
  value: ''

  constructor () {
    super()
    this.termType = 'DefaultGraph'
    this.value = ''
  }
  toCanonical () {
    return this.value
  }
}
