import Node from './node-internal'
import { TFDefaultGraph, TermType, DefaultGraphTermType } from './types';

/**
* The RDF default graph
*/
export default class DefaultGraph extends Node implements TFDefaultGraph {
  value: string
  termType: DefaultGraphTermType;

  constructor () {
    super()
    this.termType = TermType.DefaultGraph
    this.value = ''
  }
  toCanonical () {
    return this.value
  }
}
