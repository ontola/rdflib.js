import BlankNode from './blank-node'
import ClassOrder from './class-order'
import Collection from './collection'
import Literal from './literal'
import log from './log'
import NamedNode from './named-node'
import Namespace from './namespace'
import Node from './node-internal'
import Serializer from './serialize'
import Statement from './statement'
import Variable from './variable'
import { ValueType, Bindings } from './types'

/**
 * A formula, or store of RDF statements
 * @module formula
*/
export default class Formula extends Node {

  static termType: 'Graph';

  /**
   * The stored statements
   */
  statements: ReadonlyArray<Statement>;

  /**
   * The additional constraints
   */
  constraints: ReadonlyArray<any>;

  /**
   * The additional constraints
   */
  initBindings: {
    [id: string]: Node;
  }

  optional: ReadonlyArray<any>

  /**
   * Initializes this formula
   * @param statements The initial statements in this formulat
   * @param constraints The additional constraints
   * @param initBindings The initial bindings
   * @param optional
   */
  constructor(
    statements: ReadonlyArray<Statement>,
    constraints: ReadonlyArray<any>,
    initBindings: {
        [id: string]: Node;
    },
    optional: ReadonlyArray<any>
  ){
    super()
    this.termType = Formula.termType
    this.statements = statements || []
    this.constraints = constraints || []
    this.initBindings = initBindings || []
    this.optional = optional || []
  }

  /**
   * Gets a namespace for the specified namespace's URI
   * @param nsuri The URI for the namespace
   */
  ns (nsuri: string) { return Namespace(nsuri) }

  /** Add a statement from its parts
  * @param {Node} subject - the first part of the statemnt
  * @param {Node} predicate - the second part of the statemnt
  * @param {Node} obbject - the third part of the statemnt
  * @param {Node} graph - the last part of the statemnt
  */
  add (subject: Node, predicate: NamedNode, object: Node, graph?: NamedNode) {
    return (this.statements as Statement[]).push(new Statement(subject, predicate, object, graph))
  }

  /** Add a statment object
  * @param {Statement} statement - an existing constructed statement to add
  */
  addStatement (st: Statement): number {
    return (this.statements as Statement[]).push(st)
  }

  /**
   * Gets a blank node
   * @param id The node's identifier
   */
  bnode(id: string): BlankNode {
    return new BlankNode(id)
  }

  /**
   * Adds all the statements to this formula
   * @param statements A collection of statements
   */
  addAll (statements: Statement[]): void {
    statements.forEach(quad => {
      this.add(quad.subject, quad.predicate, quad.object, quad.graph)
    })
  }

  /** Follow link from one node, using one wildcard, looking for one
  *
  * For example, any(me, knows, null, profile)  - a person I know accoring to my profile .
  * any(me, knows, null, null)  - a person I know accoring to anything in store .
  * any(null, knows, me, null)  - a person who know me accoring to anything in store .
  *
  * @param {Node} subject - A node to search for as subject, or if null, a wildcard
  * @param {Node} predicate - A node to search for as predicate, or if null, a wildcard
  * @param {Node} object - A node to search for as object, or if null, a wildcard
  * @param {Node} graph - A node to search for as graph, or if null, a wildcard
  * @returns {Node} - A node which match the wildcard position, or null
  */
  any(
    s?: Node | null,
    p?: Node | null,
    o?: Node | null,
    g?: Node | null
  ): Node | null | void {
    var st = this.anyStatementMatching(s, p, o, g)
    if (st == null) {
      return void 0
    } else if (s == null) {
      return st.subject
    } else if (p == null) {
      return st.predicate
    } else if (o == null) {
      return st.object
    }
    return void 0
  }

  /**
   * Gets the value of a node that matches the specified pattern
   * @param s The subject
   * @param p The predicate
   * @param o The object
   * @param g The graph that contains the statement
   */
  anyValue(
    s?: Node | null,
    p?: Node | null,
    o?: Node | null,
    g?: Node | null
  ): string | void {
    var y = this.any(s, p, o, g)
    return y ? y.value : void 0
  }


  /**
   * Gets the first JavaScript object equivalent to a node based on the specified pattern
   * @param s The subject
   * @param p The predicate
   * @param o The object
   * @param g The graph that contains the statement
   */
  anyJS(
    s?: Node | null,
    p?: Node | null,
    o?: Node | null,
    g?: Node | null
  ): any {
    var y = this.any(s, p, o, g)
    return y ? Node.toJS(y) : void 0
  }

  /**
   * Gets the first statement that matches the specified pattern
   * @param subj The subject
   * @param pred The predicate
   * @param obj The object
   * @param why The graph that contains the statement
   */
  anyStatementMatching(
    subj?: Node | null,
    pred?: Node | null,
    obj?: Node | null,
    why?: Node | null
  ): Statement | undefined {
    var x = this.statementsMatching(subj, pred, obj, why, true)
    if (!x || x.length === 0) {
      return undefined
    }
    return x[0]
  }

  /** Search the Store
   *
   * This is really a teaching method as to do this properly you would use IndexedFormula
   *
   * @param subject - A node to search for as subject, or if null, a wildcard
   * @param predicate - A node to search for as predicate, or if null, a wildcard
   * @param object - A node to search for as object, or if null, a wildcard
   * @param graph - A node to search for as graph, or if null, a wildcard
   * @param justOne - flag - stop when found one rather than get all of them?
   * @returns {Array<Node>} - An array of nodes which match the wildcard position
   */
  statementsMatching(
    subj?: Node | null,
    pred?: Node | null,
    obj?: Node | null,
    why?: Node | null,
    justOne?: boolean
    ): Statement[] {
    let found = this.statements.filter(st =>
      (!subj || subj.sameTerm(st.subject)) &&
      (!pred || pred.sameTerm(st.predicate)) &&
      (!obj || obj.sameTerm(st.object)) &&
      (!why || why.sameTerm(st.subject))
     )
    return found
  }

  /**
   * Finds the types in the list which have no *stored* subtypes
   * These are a set of classes which provide by themselves complete
   * information -- the other classes are redundant for those who
   * know the class DAG.
   * @param types A map of the types
   */
  bottomTypeURIs(types: {
    [id: string]: string | NamedNode;
  }): {
      [id: string]: string | NamedNode;
  } {
    var bots
    var bottom
    var elt
    var i
    var k
    var len
    var ref
    var subs
    var v
    bots = []
    for (k in types) {
      if (!types.hasOwnProperty(k)) continue
      v = types[k]
      subs = this.each(void 0, this.sym('http://www.w3.org/2000/01/rdf-schema#subClassOf'), this.sym(k))
      bottom = true
      i = 0
      for (len = subs.length; i < len; i++) {
        elt = subs[i]
        ref = elt.uri
        if (ref in types) { // the subclass is one we know
          bottom = false
          break
        }
      }
      if (bottom) {
        bots[k] = v
      }
    }
    return bots
  }

  /**
   * Gets a new collection
   */
  collection (): Collection {
    return new Collection()
  }

  /** Follow links from one node, using one wildcard
  *
  * For example, each(me, knows, null, profile)  - people I know accoring to my profile .
  * each(me, knows, null, null)  - people I know accoring to anything in store .
  * each(null, knows, me, null)  - people who know me accoring to anything in store .
  *
  * @param subject - A node to search for as subject, or if null, a wildcard
  * @param predicate - A node to search for as predicate, or if null, a wildcard
  * @param object - A node to search for as object, or if null, a wildcard
  * @param graph - A node to search for as graph, or if null, a wildcard
  * @returns - An array of nodes which match the wildcard position
  */
  each(
    s?: Node | null,
    p?: Node | null,
    o?: Node | null,
    g?: Node | null
  ): Node[] {
    var elt: Statement, i, l, m, q
    var len, len1, len2, len3
    var results = []
    var sts = this.statementsMatching(s, p, o, g)
    if (s == null) {
      for (i = 0, len = sts.length; i < len; i++) {
        elt = sts[i]
        results.push(elt.subject)
      }
    } else if (p == null) {
      for (l = 0, len1 = sts.length; l < len1; l++) {
        elt = sts[l]
        results.push(elt.predicate)
      }
    } else if (o == null) {
      for (m = 0, len2 = sts.length; m < len2; m++) {
        elt = sts[m]
        results.push(elt.object)
      }
    } else if (g == null) {
      for (q = 0, len3 = sts.length; q < len3; q++) {
        elt = sts[q]
        results.push(elt.why)
      }
    }
    return results
  }

  /**
   * Gets whether this formula is equals to the other one
   * @param other The other formula
   */
  equals(other: Formula): boolean {
    if (!other) {
      return false
    }
    return this.hashString() === other.hashString()
  }

  /**
   * For thisClass or any subclass, anything which has it is its type
   * or is the object of something which has the type as its range, or subject
   * of something which has the type as its domain
   * We don't bother doing subproperty (yet?)as it doesn't seeem to be used
   * much.
   * Get all the Classes of which we can RDFS-infer the subject is a member
   * @param thisClass A named node
   * @return a hash of URIs
   */
  findMembersNT(
    thisClass: Node
  ): {
      [uri: string]: Statement;
  } {
    var i
    var l
    var len
    var len1
    var len2
    var len3
    var len4
    var m
    var members
    var pred
    var q
    var ref
    var ref1
    var ref2
    var ref3
    var ref4
    var ref5
    var seeds
    var st
    var t
    var u
    seeds = {}
    seeds[thisClass.toNT()] = true
    members = {}
    ref = this.transitiveClosure(seeds, this.sym('http://www.w3.org/2000/01/rdf-schema#subClassOf'), true)
    for (t in ref) {
      if (!ref.hasOwnProperty(t)) continue
      ref1 = this.statementsMatching(void 0,
        this.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        this.fromNT(t))
      for (i = 0, len = ref1.length; i < len; i++) {
        st = ref1[i]
        members[st.subject.toNT()] = st
      }
      ref2 = this.each(void 0,
        this.sym('http://www.w3.org/2000/01/rdf-schema#domain'),
        this.fromNT(t))
      for (l = 0, len1 = ref2.length; l < len1; l++) {
        pred = ref2[l]
        ref3 = this.statementsMatching(void 0, pred)
        for (m = 0, len2 = ref3.length; m < len2; m++) {
          st = ref3[m]
          members[st.subject.toNT()] = st
        }
      }
      ref4 = this.each(void 0,
        this.sym('http://www.w3.org/2000/01/rdf-schema#range'),
        this.fromNT(t))
      for (q = 0, len3 = ref4.length; q < len3; q++) {
        pred = ref4[q]
        ref5 = this.statementsMatching(void 0, pred)
        for (u = 0, len4 = ref5.length; u < len4; u++) {
          st = ref5[u]
          members[st.object.toNT()] = st
        }
      }
    }
    return members
  }

  /**
   * For thisClass or any subclass, anything which has it is its type
   * or is the object of something which has the type as its range, or subject
   * of something which has the type as its domain
   * We don't bother doing subproperty (yet?)as it doesn't seeem to be used
   * much.
   * Get all the Classes of which we can RDFS-infer the subject is a member
   * @param subject A named node
   */
  findMemberURIs(
    subject: Node
  ): {
      [uri: string]: Statement;
  } {
    return this.NTtoURI(this.findMembersNT(subject))
  }

  /**
   * Get all the Classes of which we can RDFS-infer the subject is a superclass
   * Returns a hash table where key is NT of type and value is statement why we
   * think so.
   * Does NOT return terms, returns URI strings.
   * We use NT representations in this version because they handle blank nodes.
   * @param subject A subject node
   */
  findSubClassesNT(
    subject: Node
  ): {
      [uri: string]: boolean;
  } {
    var types = {}
    types[subject.toNT()] = true
    return this.transitiveClosure(types,
      this.sym('http://www.w3.org/2000/01/rdf-schema#subClassOf'), true)
  }

  /**
   * Get all the Classes of which we can RDFS-infer the subject is a subclass
   * Returns a hash table where key is NT of type and value is statement why we
   * think so.
   * Does NOT return terms, returns URI strings.
   * We use NT representations in this version because they handle blank nodes.
   * @param subject A subject node
   * @returns a hash table where key is NT of type and value is statement why we
   * think so.
   */
  findSuperClassesNT(
      subject: Node
    ): {
        [uri: string]: boolean;
    } {
    var types = {}
    types[subject.toNT()] = true
    return this.transitiveClosure(types,
      this.sym('http://www.w3.org/2000/01/rdf-schema#subClassOf'), false)
  }

  /**
   * Get all the Classes of which we can RDFS-infer the subject is a member
   * todo: This will loop is there is a class subclass loop (Sublass loops are
   * not illegal)
   * @param subject - The thing whose classes are to be found
   * @returns a hash table where key is NT of type and value is statement why we think so.
   * Does NOT return terms, returns URI strings.
   * We use NT representations in this version because they handle blank nodes.
   */
  findTypesNT(
    subject: Node
  ): {
      [uri: string]: boolean;
  } {
    var domain
    var i
    var l
    var len
    var len1
    var len2
    var len3
    var m
    var q
    var range
    var rdftype
    var ref
    var ref1
    var ref2
    var ref3
    var st
    var types
    rdftype = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
    types = []
    ref = this.statementsMatching(subject, void 0, void 0)
    for (i = 0, len = ref.length; i < len; i++) {
      st = ref[i]
      if (st.predicate.uri === rdftype) {
        types[st.object.toNT()] = st
      } else {
        ref1 = this.each(st.predicate, this.sym('http://www.w3.org/2000/01/rdf-schema#domain'))
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          range = ref1[l]
          types[range.toNT()] = st
        }
      }
    }
    ref2 = this.statementsMatching(void 0, void 0, subject)
    for (m = 0, len2 = ref2.length; m < len2; m++) {
      st = ref2[m]
      ref3 = this.each(st.predicate, this.sym('http://www.w3.org/2000/01/rdf-schema#range'))
      for (q = 0, len3 = ref3.length; q < len3; q++) {
        domain = ref3[q]
        types[domain.toNT()] = st
      }
    }
    return this.transitiveClosure(types, this.sym('http://www.w3.org/2000/01/rdf-schema#subClassOf'), false)
  }

  /**
   * Get all the Classes of which we can RDFS-infer the subject is a member
   * todo: This will loop is there is a class subclass loop (Sublass loops are
   * not illegal)
   * Returns a hash table where key is NT of type and value is statement why we
   * think so.
   * Does NOT return terms, returns URI strings.
   * We use NT representations in this version because they handle blank nodes.
   * @param subject A subject node
   */
  findTypeURIs(
    subject: Node
  ): {
      [uri: string]: boolean;
  } {
    return this.NTtoURI(this.findTypesNT(subject))
  }

  /**
   * Trace statements which connect directly, or through bnodes
   *
   * @param subject - The node to start looking for statments
   * @param doc - The document to be searched, or null to search all documents
   * @returns an array of statements, duplicate statements are suppresssed.
   */
  connectedStatements(
    subject: Node,
    doc: ValueType,
    excludePredicateURIs: ReadonlyArray<string>
  ): Statement[] {
    excludePredicateURIs = excludePredicateURIs || []
    var todo = [subject]
    var done = []
    var doneArcs = []
    var result = []
    var self = this
    var follow = function (x) {
      var queue = function (x) {
        if (x.termType === 'BlankNode' && !done[x.value]) {
          done[x.value] = true
          todo.push(x)
        }
      }
      var sts = self.statementsMatching(null, null, x, doc)
        .concat(self.statementsMatching(x, null, null, doc))
      sts = sts.filter(function (st) {
        if (excludePredicateURIs[st.predicate.uri]) return false
        var hash = st.toNT()
        if (doneArcs[hash]) return false
        doneArcs[hash] = true
        return true
      }
      )
      sts.forEach(function (st, i) {
        queue(st.subject)
        queue(st.object)
      })
      result = result.concat(sts)
    }
    while (todo.length) {
      follow(todo.shift())
    }
    // console.log('' + result.length + ' statements about ' + subject)
    return result
  }

  /**
   * Creates a new empty formula - features not applicable, but necessary for typing to pass
   */
  formula(features?: ReadonlyArray<string>): Formula {
    return new Formula()
  }

  /**
   * Transforms an NTriples string format into a Node.
   * The bnode bit should not be used on program-external values; designed
   * for internal work such as storing a bnode id in an HTML attribute.
   * This will only parse the strings generated by the vaious toNT() methods.
   * @param str A string representation
   */
  fromNT(str: string): Node {
    var dt, k, lang
    switch (str[0]) {
      case '<':
        return this.sym(str.slice(1, -1))
      case '"':
        lang = void 0
        dt = void 0
        k = str.lastIndexOf('"')
        if (k < str.length - 1) {
          if (str[k + 1] === '@') {
            lang = str.slice(k + 2)
          } else if (str.slice(k + 1, k + 3) === '^^') {
            dt = this.fromNT(str.slice(k + 3))
          } else {
            throw new Error("Can't convert string from NT: " + str)
          }
        }
        str = str.slice(1, k)
        str = str.replace(/\\"/g, '"')
        str = str.replace(/\\n/g, '\n')
        str = str.replace(/\\\\/g, '\\')
        return this.literal(str, lang, dt)
      case '_':
        return new BlankNode(str.slice(2))
      case '?':
        return new Variable(str.slice(1))
    }
    throw new Error("Can't convert from NT: " + str)
  }

  /**
   * Gets whether this formula holds the specified statement
   * @param s A subject
   * @param p A predicate
   * @param o An object
   * @param g A containing graph
   */
  holds(
    s?: Node | null,
    p?: Node | null,
    o?: Node | null,
    g?: Node | null
  ): boolean {
    var i
    if (arguments.length === 1) {
      if (!s) {
        return true
      }
      if (s instanceof Array) {
        for (i = 0; i < s.length; i++) {
          if (!this.holds(s[i])) {
            return false
          }
        }
        return true
      } else if (s instanceof Statement) {
        return this.holds(s.subject, s.predicate, s.object, s.why)
      } else if (s.statements) {
        return this.holds(s.statements)
      }
    }

    var st = this.anyStatementMatching(s, p, o, g)
    return st != null
  }

  /**
   * Gets whether this formula holds the specified statement
   * @param st A statement
   */
  holdsStatement(st: Statement): boolean {
    return this.holds(st.subject, st.predicate, st.object, st.why)
  }

  /**
   * Gets a collection from a list of values
   * @param values The values
   */
  list(values: Iterable<ValueType>): Collection {
    let collection = new Collection()
    values.forEach(function (val) {
      collection.append(val)
    })
    return collection
  }

  /**
   * Gets a literal node
   * @param val The literal's lexical value
   * @param lang The language
   * @param dt The datatype as a named node
   */
  literal(val: string, lang: string, dt: NamedNode): Literal {
    return new Literal('' + val, lang, dt)
  }

  /**
   * Transform a collection of NTriple URIs into their URI strings
   * @param t some iterable colletion of NTriple URI strings
   * @return a collection of the URIs as strings
   * todo: explain why it is important to go through NT
   */
  NTtoURI(t: {
    [uri: string]: any;
  }): {
    [uri: string]: any;
  }{
    var k, v
    var uris = {}
    for (k in t) {
      if (!t.hasOwnProperty(k)) continue
      v = t[k]
      if (k[0] === '<') {
        uris[k.slice(1, -1)] = v
      }
    }
    return uris
  }

  /**
   * Serializes this formula
   * @param base The base string
   * @param contentType The content type of the syntax to use
   * @param provenance The provenance URI
   */
  serialize(base: string, contentType: string, provenance: string): string {
    var documentString
    var sts
    var sz
    sz = Serializer(this)
    sz.suggestNamespaces(this.namespaces)
    sz.setBase(base)
    if (provenance) {
      sts = this.statementsMatching(void 0, void 0, void 0, provenance)
    } else {
      sts = this.statements
    }
    switch (
    contentType != null ? contentType : 'text/n3') {
      case 'application/rdf+xml':
        documentString = sz.statementsToXML(sts)
        break
      case 'text/n3':
      case 'text/turtle':
        documentString = sz.statementsToN3(sts)
        break
      default:
        throw new Error('serialize: Content-type ' + contentType +
          ' not supported.')
    }
    return documentString
  }

  /**
   * Gets a new formula with the substituting bindings applied
   * @param bindings The bindings to substitute
   */
  substitute(bindings: Bindings): Formula {
    var statementsCopy = this.statements.map(function (ea) {
      return ea.substitute(bindings)
    })
    console.log('Formula subs statmnts:' + statementsCopy)
    var y = new Formula()
    y.add(statementsCopy)
    console.log('indexed-form subs formula:' + y)
    return y
  }

  /**
   * Gets an named node for an URI
   * @param uri The URI
   */
  sym(uri: string | NamedNode, name?: string): NamedNode {
    if (name) {
      throw new Error('This feature (kb.sym with 2 args) is removed. Do not assume prefix mappings.')
    }
    return new NamedNode(uri)
  }

  /**
   * Gets the node matching the specified pattern
   * @param s The subject
   * @param p The predicate
   * @param o The object
   * @param g The graph that contains the statement
   */
  the(
    s?: Node | null,
    p?: Node | null,
    o?: Node | null,
    g?: Node | null
  ): Node | void | null {
    var x = this.any(s, p, o, g)
    if (x == null) {
      log.error('No value found for the() {' + s + ' ' + p + ' ' + o + '}.')
    }
    return x
  }

  /**
   * RDFS Inference
   * These are hand-written implementations of a backward-chaining reasoner
   * over the RDFS axioms.
   * @param seeds A hash of NTs of classes to start with
   * @param predicate The property to trace though
   * @param inverse Trace inverse direction
   */
  transitiveClosure(
    seeds: {
        [uri: string]: boolean;
    },
    predicate: Node,
    inverse: Node
  ): {
      [uri: string]: boolean;
  } {
    var elt, i, len, s, sups, t
    var agenda = {}
    Object.assign(agenda, seeds)  // make a copy
    var done = {}  // classes we have looked up
    while (true) {
      t = (function () {
        for (var p in agenda) {
          if (!agenda.hasOwnProperty(p)) continue
          return p
        }
      })()
      if (t == null) {
        return done
      }
      sups = inverse ? this.each(void 0, predicate, this.fromNT(t)) : this.each(this.fromNT(t), predicate)
      for (i = 0, len = sups.length; i < len; i++) {
        elt = sups[i]
        s = elt.toNT()
        if (s in done) {
          continue
        }
        if (s in agenda) {
          continue
        }
        agenda[s] = agenda[t]
      }
      done[t] = agenda[t]
      delete agenda[t]
    }
  }

  /**
   * Finds the types in the list which have no *stored* supertypes
   * We exclude the universal class, owl:Things and rdf:Resource, as it is
   * information-free.
   * @param types The types
   */
  topTypeURIs(types: {
    [id: string]: string | NamedNode;
  }): {
      [id: string]: string | NamedNode;
  } {
    var i
    var j
    var k
    var len
    var n
    var ref
    var tops
    var v
    tops = []
    for (k in types) {
      if (!types.hasOwnProperty(k)) continue
      v = types[k]
      n = 0
      ref = this.each(this.sym(k), this.sym('http://www.w3.org/2000/01/rdf-schema#subClassOf'))
      for (i = 0, len = ref.length; i < len; i++) {
        j = ref[i]
        if (j.uri !== 'http://www.w3.org/2000/01/rdf-schema#Resource') {
          n++
          break
        }
      }
      if (!n) {
        tops[k] = v
      }
    }
    if (tops['http://www.w3.org/2000/01/rdf-schema#Resource']) {
      delete tops['http://www.w3.org/2000/01/rdf-schema#Resource']
    }
    if (tops['http://www.w3.org/2002/07/owl#Thing']) {
      delete tops['http://www.w3.org/2002/07/owl#Thing']
    }
    return tops
  }

  /**
   * Serializes this formulat to a string
   */
  toString(): string {
    return '{' + this.statements.join('\n') + '}'
  }

  variable (name: string): Variable

  /**
   * Gets the number of statements in this formulat that matches the specified pattern
   * @param s The subject
   * @param p The predicate
   * @param o The object
   * @param g The graph that contains the statement
   */
  whether(
    s?: Node | null,
    p?: Node | null,
    o?: Node | null,
    g?: Node | null
  ): number {
    return this.statementsMatching(s, p, o, g).length
  }
}
Formula.termType = 'Graph'

Formula.prototype.classOrder = ClassOrder['Graph']
Formula.prototype.isVar = false

Formula.prototype.ns = Namespace

/**
 * Gets a new variable
 * @param name The variable's name
 */
Formula.prototype.variable = (name: string): Variable => new Variable(name)
