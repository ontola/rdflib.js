import NamedNode from './named-node'

/**
 * Gets a namespace for the specified namespace's URI
 * @param nsuri The URI for the namespace
 */
export default function Namespace (nsuri: string) {
  return function (ln: string) {
    return new NamedNode(nsuri + (ln || ''))
  }
}
