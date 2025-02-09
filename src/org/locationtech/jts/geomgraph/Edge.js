import EdgeIntersectionList from './EdgeIntersectionList'
import IntersectionMatrix from '../geom/IntersectionMatrix'
import MonotoneChainEdge from './index/MonotoneChainEdge'
import Position from './Position'
import Coordinate from '../geom/Coordinate'
import Label from './Label'
import Envelope from '../geom/Envelope'
import StringBuilder from '../../../../java/lang/StringBuilder'
import Depth from './Depth'
import GraphComponent from './GraphComponent'
export default class Edge extends GraphComponent {
  constructor () {
    super()
    Edge.constructor_.apply(this, arguments)
  }
  static updateIM () {
    if (arguments.length === 2 && (arguments[1] instanceof IntersectionMatrix && arguments[0] instanceof Label)) {
      let label = arguments[0]; let im = arguments[1]
      im.setAtLeastIfValid(label.getLocation(0, Position.ON), label.getLocation(1, Position.ON), 1)
      if (label.isArea()) {
        im.setAtLeastIfValid(label.getLocation(0, Position.LEFT), label.getLocation(1, Position.LEFT), 2)
        im.setAtLeastIfValid(label.getLocation(0, Position.RIGHT), label.getLocation(1, Position.RIGHT), 2)
      }
    } else return super.updateIM.apply(this, arguments)
  }
  getDepth () {
    return this._depth
  }
  getCollapsedEdge () {
    var newPts = new Array(2).fill(null)
    newPts[0] = this.pts[0]
    newPts[1] = this.pts[1]
    var newe = new Edge(newPts, Label.toLineLabel(this._label))
    return newe
  }
  isIsolated () {
    return this._isIsolated
  }
  getCoordinates () {
    return this.pts
  }
  setIsolated (isIsolated) {
    this._isIsolated = isIsolated
  }
  setName (name) {
    this._name = name
  }
  equals (o) {
    if (!(o instanceof Edge)) return false
    var e = o
    if (this.pts.length !== e.pts.length) return false
    var isEqualForward = true
    var isEqualReverse = true
    var iRev = this.pts.length
    for (var i = 0; i < this.pts.length; i++) {
      if (!this.pts[i].equals2D(e.pts[i])) {
        isEqualForward = false
      }
      if (!this.pts[i].equals2D(e.pts[--iRev])) {
        isEqualReverse = false
      }
      if (!isEqualForward && !isEqualReverse) return false
    }
    return true
  }
  getCoordinate () {
    if (arguments.length === 0) {
      if (this.pts.length > 0) return this.pts[0]
      return null
    } else if (arguments.length === 1) {
      let i = arguments[0]
      return this.pts[i]
    }
  }
  print (out) {
    out.print('edge ' + this._name + ': ')
    out.print('LINESTRING (')
    for (var i = 0; i < this.pts.length; i++) {
      if (i > 0) out.print(',')
      out.print(this.pts[i].x + ' ' + this.pts[i].y)
    }
    out.print(')  ' + this._label + ' ' + this._depthDelta)
  }
  computeIM (im) {
    Edge.updateIM(this._label, im)
  }
  isCollapsed () {
    if (!this._label.isArea()) return false
    if (this.pts.length !== 3) return false
    if (this.pts[0].equals(this.pts[2])) return true
    return false
  }
  isClosed () {
    return this.pts[0].equals(this.pts[this.pts.length - 1])
  }
  getMaximumSegmentIndex () {
    return this.pts.length - 1
  }
  getDepthDelta () {
    return this._depthDelta
  }
  getNumPoints () {
    return this.pts.length
  }
  printReverse (out) {
    out.print('edge ' + this._name + ': ')
    for (var i = this.pts.length - 1; i >= 0; i--) {
      out.print(this.pts[i] + ' ')
    }
    out.println('')
  }
  getMonotoneChainEdge () {
    if (this._mce === null) this._mce = new MonotoneChainEdge(this)
    return this._mce
  }
  getEnvelope () {
    if (this._env === null) {
      this._env = new Envelope()
      for (var i = 0; i < this.pts.length; i++) {
        this._env.expandToInclude(this.pts[i])
      }
    }
    return this._env
  }
  addIntersection (li, segmentIndex, geomIndex, intIndex) {
    var intPt = new Coordinate(li.getIntersection(intIndex))
    var normalizedSegmentIndex = segmentIndex
    var dist = li.getEdgeDistance(geomIndex, intIndex)
    var nextSegIndex = normalizedSegmentIndex + 1
    if (nextSegIndex < this.pts.length) {
      var nextPt = this.pts[nextSegIndex]
      if (intPt.equals2D(nextPt)) {
        normalizedSegmentIndex = nextSegIndex
        dist = 0.0
      }
    }
    var ei = this.eiList.add(intPt, normalizedSegmentIndex, dist)
  }
  toString () {
    var builder = new StringBuilder()
    builder.append('edge ' + this._name + ': ')
    builder.append('LINESTRING (')
    for (var i = 0; i < this.pts.length; i++) {
      if (i > 0) builder.append(',')
      builder.append(this.pts[i].x + ' ' + this.pts[i].y)
    }
    builder.append(')  ' + this._label + ' ' + this._depthDelta)
    return builder.toString()
  }
  isPointwiseEqual (e) {
    if (this.pts.length !== e.pts.length) return false
    for (var i = 0; i < this.pts.length; i++) {
      if (!this.pts[i].equals2D(e.pts[i])) {
        return false
      }
    }
    return true
  }
  setDepthDelta (depthDelta) {
    this._depthDelta = depthDelta
  }
  getEdgeIntersectionList () {
    return this.eiList
  }
  addIntersections (li, segmentIndex, geomIndex) {
    for (var i = 0; i < li.getIntersectionNum(); i++) {
      this.addIntersection(li, segmentIndex, geomIndex, i)
    }
  }
  getClass () {
    return Edge
  }
  get interfaces_ () {
    return []
  }
}
Edge.constructor_ = function () {
  this.pts = null
  this._env = null
  this.eiList = new EdgeIntersectionList(this)
  this._name = null
  this._mce = null
  this._isIsolated = true
  this._depth = new Depth()
  this._depthDelta = 0
  if (arguments.length === 1) {
    let pts = arguments[0]
    Edge.constructor_.call(this, pts, null)
  } else if (arguments.length === 2) {
    let pts = arguments[0]; let label = arguments[1]
    this.pts = pts
    this._label = label
  }
}
