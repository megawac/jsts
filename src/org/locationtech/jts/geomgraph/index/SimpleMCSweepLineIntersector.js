import hasInterface from '../../../../../hasInterface'
import MonotoneChain from './MonotoneChain'
import SweepLineEvent from './SweepLineEvent'
import EdgeSetIntersector from './EdgeSetIntersector'
import Collections from '../../../../../java/util/Collections'
import SegmentIntersector from './SegmentIntersector'
import ArrayList from '../../../../../java/util/ArrayList'
import List from '../../../../../java/util/List'
export default class SimpleMCSweepLineIntersector extends EdgeSetIntersector {
  constructor () {
    super()
    SimpleMCSweepLineIntersector.constructor_.apply(this, arguments)
  }
  prepareEvents () {
    Collections.sort(this.events)
    for (var i = 0; i < this.events.size(); i++) {
      var ev = this.events.get(i)
      if (ev.isDelete()) {
        ev.getInsertEvent().setDeleteEventIndex(i)
      }
    }
  }
  computeIntersections () {
    if (arguments.length === 1) {
      let si = arguments[0]
      this.nOverlaps = 0
      this.prepareEvents()
      for (var i = 0; i < this.events.size(); i++) {
        var ev = this.events.get(i)
        if (ev.isInsert()) {
          this.processOverlaps(i, ev.getDeleteEventIndex(), ev, si)
        }
        if (si.isDone()) {
          break
        }
      }
    } else if (arguments.length === 3) {
      if (arguments[2] instanceof SegmentIntersector && (hasInterface(arguments[0], List) && hasInterface(arguments[1], List))) {
        let edges0 = arguments[0]; let edges1 = arguments[1]; let si = arguments[2]
        this.addEdges(edges0, edges0)
        this.addEdges(edges1, edges1)
        this.computeIntersections(si)
      } else if (typeof arguments[2] === 'boolean' && (hasInterface(arguments[0], List) && arguments[1] instanceof SegmentIntersector)) {
        let edges = arguments[0]; let si = arguments[1]; let testAllSegments = arguments[2]
        if (testAllSegments) this.addEdges(edges, null); else this.addEdges(edges)
        this.computeIntersections(si)
      }
    }
  }
  addEdge (edge, edgeSet) {
    var mce = edge.getMonotoneChainEdge()
    var startIndex = mce.getStartIndexes()
    for (var i = 0; i < startIndex.length - 1; i++) {
      var mc = new MonotoneChain(mce, i)
      var insertEvent = new SweepLineEvent(edgeSet, mce.getMinX(i), mc)
      this.events.add(insertEvent)
      this.events.add(new SweepLineEvent(mce.getMaxX(i), insertEvent))
    }
  }
  processOverlaps (start, end, ev0, si) {
    var mc0 = ev0.getObject()
    for (var i = start; i < end; i++) {
      var ev1 = this.events.get(i)
      if (ev1.isInsert()) {
        var mc1 = ev1.getObject()
        if (!ev0.isSameLabel(ev1)) {
          mc0.computeIntersections(mc1, si)
          this.nOverlaps++
        }
      }
    }
  }
  addEdges () {
    if (arguments.length === 1) {
      let edges = arguments[0]
      for (var i = edges.iterator(); i.hasNext();) {
        var edge = i.next()
        this.addEdge(edge, edge)
      }
    } else if (arguments.length === 2) {
      let edges = arguments[0]; let edgeSet = arguments[1]
      for (var i = edges.iterator(); i.hasNext();) {
        var edge = i.next()
        this.addEdge(edge, edgeSet)
      }
    }
  }
  getClass () {
    return SimpleMCSweepLineIntersector
  }
  get interfaces_ () {
    return []
  }
}
SimpleMCSweepLineIntersector.constructor_ = function () {
  this.events = new ArrayList()
  this.nOverlaps = null
}
