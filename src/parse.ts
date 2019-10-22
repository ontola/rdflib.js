import DataFactory from './data-factory'
import jsonldParser from './jsonldparser'
import { Parser as N3jsParser } from 'n3'  // @@ Goal: remove this dependency
import N3Parser from './n3parser'
import { parseRDFaDOM } from './rdfaparser'
import RDFParser from './rdfxmlparser'
import sparqlUpdateParser from './patch-parser'
import * as Util from './util'
import Formula from './formula';
import { TFQuad } from './types';

/**
 * Set of handled MIME types
 */
export type mimeTypes =
  'application/ld+json' |
  'application/n-quads' |
  'application/nquads' |
  'application/rdf+xml' |
  'application/sparql-update' |
  'application/xhtml+xml' |
  'text/html' |
  'text/n3' |
  'text/turtle'

/**
 * Parse a string and put the result into the graph kb.
 * Normal method is sync.
 * Unfortunately jsdonld is currently written to need to be called async.
 * Hence the mess below with executeCallback.
 * @param str The input string to parse
 * @param kb The store to use
 * @param base The base URI to use
 * @param contentType The content type for the input
 * @param callback The callback to call when the data has been loaded
 */
export default function parse (
  str: string,
  kb: Formula,
  base: string,
  contentType?: string,
  callback: (error: any, kb: Formula | null) => void
) {
  contentType = contentType || 'text/turtle'
  contentType = contentType.split(';')[0]
  try {
    if (contentType === 'text/n3' || contentType === 'text/turtle') {
      var p = N3Parser(kb, kb, base, base, null, null, '', null)
      p.loadBuf(str)
      executeCallback()
    } else if (contentType === 'application/rdf+xml') {
      var parser = new RDFParser(kb)
      parser.parse(Util.parseXML(str), base, kb.sym(base))
      executeCallback()
    } else if (contentType === 'application/xhtml+xml') {
      parseRDFaDOM(Util.parseXML(str, {contentType: 'application/xhtml+xml'}), kb, base)
      executeCallback()
    } else if (contentType === 'text/html') {
      parseRDFaDOM(Util.parseXML(str, {contentType: 'text/html'}), kb, base)
      executeCallback()
    } else if (contentType === 'application/sparql-update') { // @@ we handle a subset
      sparqlUpdateParser(str, kb, base)
      executeCallback()
    } else if (contentType === 'application/ld+json') {
      jsonldParser(str, kb, base, executeCallback)
    } else if (contentType === 'application/nquads' ||
               contentType === 'application/n-quads') {
      var n3Parser = new N3jsParser({ factory: DataFactory })
      nquadCallback(null, str)
    } else {
      throw new Error("Don't know how to parse " + contentType + ' yet')
    }
  } catch (e) {
    executeErrorCallback(e)
  }

  (parse as any).handled= {
    'text/n3': true,
    'text/turtle': true,
    'application/rdf+xml': true,
    'application/xhtml+xml': true,
    'text/html': true,
    'application/sparql-update': true,
    'application/ld+json': true,
    'application/nquads' : true,
    'application/n-quads' : true
  }

  function executeCallback () {
    if (callback) {
      callback(null, kb)
    } else {
      return
    }
  }

  function executeErrorCallback (e: Error): void {
    if (
      contentType !== 'application/ld+json' ||
      contentType !== 'application/nquads' ||
      contentType !== 'application/n-quads'
    ) {
      if (callback) {
        callback(e, kb)
      } else {
        let e2 = new Error('' + e + ' while trying to parse <' + base + '> as ' + contentType)
        e2.cause = e
        throw e2.
      }
    }
  }
/*
  function setJsonLdBase (doc, base) {
    if (doc instanceof Array) {
      return
    }
    if (!('@context' in doc)) {
      doc['@context'] = {}
    }
    doc['@context']['@base'] = base
  }
*/
  function nquadCallback (err, nquads) {
    if (err) {
      callback(err, kb)
    }
    try {
      n3Parser.parse(nquads, tripleCallback)
    } catch (err) {
      callback(err, kb)
    }
  }

  function tripleCallback (err: Error, triple: TFQuad) {
    if (triple) {
      kb.add(triple.subject, triple.predicate, triple.object, triple.graph)
    } else {
      callback(err, kb)
    }
  }
}
