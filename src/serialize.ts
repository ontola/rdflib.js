import * as convert from './convert'
import Serializer from './serializer'
import { ContentType, ContentTypes, TFNamedNode, TFBlankNode } from './types'
import IndexedFormula from './store'
import { Formula } from './index'

/**
 * Serialize to the appropriate format
 */
export default function serialize (
  /** The graph or nodes that should be serialized */
  target: Formula | TFNamedNode | TFBlankNode,
  /** The store */
  kb?: IndexedFormula,
  base?,
  /**
   * The mime type.
   * Defaults to Turtle.
   */
  contentType?: string | ContentTypes,
  callback?: (err?: Error | null, result?: string ) => void,
  options?
) {
  base = base || target.value
  options = options || {}
  contentType = contentType || ContentType.turtle // text/n3 if complex?
  var documentString: string | null = null
  try {
    var sz = Serializer(kb)
    if (options.flags) sz.setFlags(options.flags)
    var newSts = kb!.statementsMatching(undefined, undefined, undefined, target)
    var n3String: string
    sz.suggestNamespaces(kb!.namespaces)
    sz.setBase(base)
    switch (contentType) {
      case ContentType.rdfxml:
        documentString = sz.statementsToXML(newSts)
        return executeCallback(null, documentString)
      case ContentType.n3:
      case ContentType.n3Legacy:
        documentString = sz.statementsToN3(newSts)
        return executeCallback(null, documentString)
      case ContentType.turtle:
      case ContentType.turtleLegacy:
        sz.setFlags('si') // Suppress = for sameAs and => for implies
        documentString = sz.statementsToN3(newSts)
        return executeCallback(null, documentString)
      case ContentType.nTriples:
        sz.setFlags('deinprstux') // Suppress nice parts of N3 to make ntriples
        documentString = sz.statementsToNTriples(newSts)
        return executeCallback(null, documentString)
      case ContentType.jsonld:
        sz.setFlags('deinprstux') // Use adapters to connect to incmpatible parser
        n3String = sz.statementsToNTriples(newSts)
        // n3String = sz.statementsToN3(newSts)
        convert.convertToJson(n3String, callback)
        break
      case ContentType.nQuads:
      case ContentType.nQuadsAlt: // @@@ just outpout the quads? Does not work for collections
        sz.setFlags('deinprstux q') // Suppress nice parts of N3 to make ntriples
        documentString = sz.statementsToNTriples(newSts) // q in flag means actually quads
        return executeCallback(null, documentString)
        // n3String = sz.statementsToN3(newSts)
        // documentString = convert.convertToNQuads(n3String, callback)
        // break
      default:
        throw new Error('Serialize: Content-type ' + contentType + ' not supported for data write.')
    }
  } catch (err) {
    if (callback) {
      return callback(err)
    }
    throw err // Don't hide problems from caller in sync mode
  }

  function executeCallback (err?: Error | null, result?: string) {
    if (callback) {
      callback(err, result)
      return
    } else {
      return result
    }
  }
}
