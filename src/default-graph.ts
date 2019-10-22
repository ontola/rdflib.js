import Node from './node-internal'
import { TFDefaultGraph } from './types';

export default class DefaultGraph extends Node implements TFDefaultGraph {
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
