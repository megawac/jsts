import hasInterface from '../../../../../hasInterface'
import SweepLineSegment from './SweepLineSegment'
import SweepLineEvent from './SweepLineEvent'
import EdgeSetIntersector from './EdgeSetIntersector'
import Collections from '../../../../../java/util/Collections'
import SegmentIntersector from './SegmentIntersector'
import ArrayList from '../../../../../java/util/ArrayList'
import Edge from '../Edge'
import List from '../../../../../java/util/List'
export default class SimpleSweepLineIntersector extends EdgeSetIntersector {
  constructor () {
    super()
    SimpleSweepLineIntersector.constructor_.apply(this, arguments)
  }
  processOverlaps (start, end, ev0, si) {
    var ss0 = ev0.getObject()
    for (var i = start; i < end; i++) {
      var ev1 = this.events.get(i)
      if (ev1.isInsert()) {
        var ss1 = ev1.getObject()
        if (!ev0.isSameLabel(ev1)) {
          ss0.computeIntersections(ss1, si)
          this.nOverlaps++
        }
      }
    }
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
      }
    } else if (arguments.length === 3) {
      if (arguments[2] instanceof SegmentIntersector && (hasInterface(arguments[0], List) && hasInterface(arguments[1], List))) {
        let edges0 = arguments[0]; let edges1 = arguments[1]; let si = arguments[2]
        this.add(edges0, edges0)
        this.add(edges1, edges1)
        this.computeIntersections(si)
      } else if (typeof arguments[2] === 'boolean' && (hasInterface(arguments[0], List) && arguments[1] instanceof SegmentIntersector)) {
        let edges = arguments[0]; let si = arguments[1]; let testAllSegments = arguments[2]
        if (testAllSegments) this.add(edges, null); else this.add(edges)
        this.computeIntersections(si)
      }
    }
  }
  add () {
    if (arguments.length === 1) {
      let edges = arguments[0]
      for (var i = edges.iterator(); i.hasNext();) {
        var edge = i.next()
        this.add(edge, edge)
      }
    } else if (arguments.length === 2) {
      if (hasInterface(arguments[0], List) && arguments[1] instanceof Object) {
        let edges = arguments[0]; let edgeSet = arguments[1]
        for (var i = edges.iterator(); i.hasNext();) {
          var edge = i.next()
          this.add(edge, edgeSet)
        }
      } else if (arguments[0] instanceof Edge && arguments[1] instanceof Object) {
        let edge = arguments[0]; let edgeSet = arguments[1]
        var pts = edge.getCoordinates()
        for (var i = 0; i < pts.length - 1; i++) {
          var ss = new SweepLineSegment(edge, i)
          var insertEvent = new SweepLineEvent(edgeSet, ss.getMinX(), null)
          this.events.add(insertEvent)
          this.events.add(new SweepLineEvent(ss.getMaxX(), insertEvent))
        }
      }
    }
  }
  getClass () {
    return SimpleSweepLineIntersector
  }
  get interfaces_ () {
    return []
  }
}
SimpleSweepLineIntersector.constructor_ = function () {
  this.events = new ArrayList()
  this.nOverlaps = null
}
