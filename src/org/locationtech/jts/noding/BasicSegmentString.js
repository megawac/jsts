import WKTWriter from '../io/WKTWriter'
import CoordinateArraySequence from '../geom/impl/CoordinateArraySequence'
import Octant from './Octant'
import SegmentString from './SegmentString'
export default class BasicSegmentString {
  constructor () {
    BasicSegmentString.constructor_.apply(this, arguments)
  }
  getCoordinates () {
    return this._pts
  }
  size () {
    return this._pts.length
  }
  getCoordinate (i) {
    return this._pts[i]
  }
  isClosed () {
    return this._pts[0].equals(this._pts[this._pts.length - 1])
  }
  getSegmentOctant (index) {
    if (index === this._pts.length - 1) return -1
    return Octant.octant(this.getCoordinate(index), this.getCoordinate(index + 1))
  }
  setData (data) {
    this._data = data
  }
  getData () {
    return this._data
  }
  toString () {
    return WKTWriter.toLineString(new CoordinateArraySequence(this._pts))
  }
  getClass () {
    return BasicSegmentString
  }
  get interfaces_ () {
    return [SegmentString]
  }
}
BasicSegmentString.constructor_ = function () {
  this._pts = null
  this._data = null
  let pts = arguments[0]; let data = arguments[1]
  this._pts = pts
  this._data = data
}
