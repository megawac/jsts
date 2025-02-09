import Location from '../geom/Location'
import EdgeEnd from './EdgeEnd'
import Position from './Position'
import TopologyException from '../geom/TopologyException'
import Label from './Label'
export default class DirectedEdge extends EdgeEnd {
  constructor () {
    super()
    DirectedEdge.constructor_.apply(this, arguments)
  }
  static depthFactor (currLocation, nextLocation) {
    if (currLocation === Location.EXTERIOR && nextLocation === Location.INTERIOR) return 1; else if (currLocation === Location.INTERIOR && nextLocation === Location.EXTERIOR) return -1
    return 0
  }
  getNextMin () {
    return this._nextMin
  }
  getDepth (position) {
    return this._depth[position]
  }
  setVisited (isVisited) {
    this._isVisited = isVisited
  }
  computeDirectedLabel () {
    this._label = new Label(this._edge.getLabel())
    if (!this._isForward) this._label.flip()
  }
  getNext () {
    return this._next
  }
  setDepth (position, depthVal) {
    if (this._depth[position] !== -999) {
      if (this._depth[position] !== depthVal) throw new TopologyException('assigned depths do not match', this.getCoordinate())
    }
    this._depth[position] = depthVal
  }
  isInteriorAreaEdge () {
    var isInteriorAreaEdge = true
    for (var i = 0; i < 2; i++) {
      if (!(this._label.isArea(i) && this._label.getLocation(i, Position.LEFT) === Location.INTERIOR && this._label.getLocation(i, Position.RIGHT) === Location.INTERIOR)) {
        isInteriorAreaEdge = false
      }
    }
    return isInteriorAreaEdge
  }
  setNextMin (nextMin) {
    this._nextMin = nextMin
  }
  print (out) {
    super.print.call(this, out)
    out.print(' ' + this._depth[Position.LEFT] + '/' + this._depth[Position.RIGHT])
    out.print(' (' + this.getDepthDelta() + ')')
    if (this._isInResult) out.print(' inResult')
  }
  setMinEdgeRing (minEdgeRing) {
    this._minEdgeRing = minEdgeRing
  }
  isLineEdge () {
    var isLine = this._label.isLine(0) || this._label.isLine(1)
    var isExteriorIfArea0 = !this._label.isArea(0) || this._label.allPositionsEqual(0, Location.EXTERIOR)
    var isExteriorIfArea1 = !this._label.isArea(1) || this._label.allPositionsEqual(1, Location.EXTERIOR)
    return isLine && isExteriorIfArea0 && isExteriorIfArea1
  }
  setEdgeRing (edgeRing) {
    this._edgeRing = edgeRing
  }
  getMinEdgeRing () {
    return this._minEdgeRing
  }
  getDepthDelta () {
    var depthDelta = this._edge.getDepthDelta()
    if (!this._isForward) depthDelta = -depthDelta
    return depthDelta
  }
  setInResult (isInResult) {
    this._isInResult = isInResult
  }
  getSym () {
    return this._sym
  }
  isForward () {
    return this._isForward
  }
  getEdge () {
    return this._edge
  }
  printEdge (out) {
    this.print(out)
    out.print(' ')
    if (this._isForward) this._edge.print(out); else this._edge.printReverse(out)
  }
  setSym (de) {
    this._sym = de
  }
  setVisitedEdge (isVisited) {
    this.setVisited(isVisited)
    this._sym.setVisited(isVisited)
  }
  setEdgeDepths (position, depth) {
    var depthDelta = this.getEdge().getDepthDelta()
    if (!this._isForward) depthDelta = -depthDelta
    var directionFactor = 1
    if (position === Position.LEFT) directionFactor = -1
    var oppositePos = Position.opposite(position)
    var delta = depthDelta * directionFactor
    var oppositeDepth = depth + delta
    this.setDepth(position, depth)
    this.setDepth(oppositePos, oppositeDepth)
  }
  getEdgeRing () {
    return this._edgeRing
  }
  isInResult () {
    return this._isInResult
  }
  setNext (next) {
    this._next = next
  }
  isVisited () {
    return this._isVisited
  }
  getClass () {
    return DirectedEdge
  }
  get interfaces_ () {
    return []
  }
}
DirectedEdge.constructor_ = function () {
  this._isForward = null
  this._isInResult = false
  this._isVisited = false
  this._sym = null
  this._next = null
  this._nextMin = null
  this._edgeRing = null
  this._minEdgeRing = null
  this._depth = [0, -999, -999]
  let edge = arguments[0]; let isForward = arguments[1]
  EdgeEnd.constructor_.call(this, edge)
  this._isForward = isForward
  if (isForward) {
    this.init(edge.getCoordinate(0), edge.getCoordinate(1))
  } else {
    var n = edge.getNumPoints() - 1
    this.init(edge.getCoordinate(n), edge.getCoordinate(n - 1))
  }
  this.computeDirectedLabel()
}
