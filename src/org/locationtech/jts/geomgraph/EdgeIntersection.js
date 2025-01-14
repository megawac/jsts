import Coordinate from '../geom/Coordinate'
import Comparable from '../../../../java/lang/Comparable'
export default class EdgeIntersection {
  constructor () {
    EdgeIntersection.constructor_.apply(this, arguments)
  }
  getSegmentIndex () {
    return this.segmentIndex
  }
  getCoordinate () {
    return this.coord
  }
  print (out) {
    out.print(this.coord)
    out.print(' seg # = ' + this.segmentIndex)
    out.println(' dist = ' + this.dist)
  }
  compareTo (obj) {
    var other = obj
    return this.compare(other.segmentIndex, other.dist)
  }
  isEndPoint (maxSegmentIndex) {
    if (this.segmentIndex === 0 && this.dist === 0.0) return true
    if (this.segmentIndex === maxSegmentIndex) return true
    return false
  }
  toString () {
    return this.coord + ' seg # = ' + this.segmentIndex + ' dist = ' + this.dist
  }
  getDistance () {
    return this.dist
  }
  compare (segmentIndex, dist) {
    if (this.segmentIndex < segmentIndex) return -1
    if (this.segmentIndex > segmentIndex) return 1
    if (this.dist < dist) return -1
    if (this.dist > dist) return 1
    return 0
  }
  getClass () {
    return EdgeIntersection
  }
  get interfaces_ () {
    return [Comparable]
  }
}
EdgeIntersection.constructor_ = function () {
  this.coord = null
  this.segmentIndex = null
  this.dist = null
  let coord = arguments[0]; let segmentIndex = arguments[1]; let dist = arguments[2]
  this.coord = new Coordinate(coord)
  this.segmentIndex = segmentIndex
  this.dist = dist
}
