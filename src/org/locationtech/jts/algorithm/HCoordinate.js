import NotRepresentableException from './NotRepresentableException'
import Coordinate from '../geom/Coordinate'
import Double from '../../../../java/lang/Double'
export default class HCoordinate {
  constructor () {
    HCoordinate.constructor_.apply(this, arguments)
  }
  static intersection (p1, p2, q1, q2) {
    var px = p1.y - p2.y
    var py = p2.x - p1.x
    var pw = p1.x * p2.y - p2.x * p1.y
    var qx = q1.y - q2.y
    var qy = q2.x - q1.x
    var qw = q1.x * q2.y - q2.x * q1.y
    var x = py * qw - qy * pw
    var y = qx * pw - px * qw
    var w = px * qy - qx * py
    var xInt = x / w
    var yInt = y / w
    if (Double.isNaN(xInt) || (Double.isInfinite(xInt) || Double.isNaN(yInt)) || Double.isInfinite(yInt)) {
      throw new NotRepresentableException()
    }
    return new Coordinate(xInt, yInt)
  }
  getY () {
    var a = this.y / this.w
    if (Double.isNaN(a) || Double.isInfinite(a)) {
      throw new NotRepresentableException()
    }
    return a
  }
  getX () {
    var a = this.x / this.w
    if (Double.isNaN(a) || Double.isInfinite(a)) {
      throw new NotRepresentableException()
    }
    return a
  }
  getCoordinate () {
    var p = new Coordinate()
    p.x = this.getX()
    p.y = this.getY()
    return p
  }
  getClass () {
    return HCoordinate
  }
  get interfaces_ () {
    return []
  }
}
HCoordinate.constructor_ = function () {
  this.x = null
  this.y = null
  this.w = null
  if (arguments.length === 0) {
    this.x = 0.0
    this.y = 0.0
    this.w = 1.0
  } else if (arguments.length === 1) {
    let p = arguments[0]
    this.x = p.x
    this.y = p.y
    this.w = 1.0
  } else if (arguments.length === 2) {
    if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      let _x = arguments[0]; let _y = arguments[1]
      this.x = _x
      this.y = _y
      this.w = 1.0
    } else if (arguments[0] instanceof HCoordinate && arguments[1] instanceof HCoordinate) {
      let p1 = arguments[0]; let p2 = arguments[1]
      this.x = p1.y * p2.w - p2.y * p1.w
      this.y = p2.x * p1.w - p1.x * p2.w
      this.w = p1.x * p2.y - p2.x * p1.y
    } else if (arguments[0] instanceof Coordinate && arguments[1] instanceof Coordinate) {
      let p1 = arguments[0]; let p2 = arguments[1]
      this.x = p1.y - p2.y
      this.y = p2.x - p1.x
      this.w = p1.x * p2.y - p2.x * p1.y
    }
  } else if (arguments.length === 3) {
    let _x = arguments[0]; let _y = arguments[1]; let _w = arguments[2]
    this.x = _x
    this.y = _y
    this.w = _w
  } else if (arguments.length === 4) {
    let p1 = arguments[0]; let p2 = arguments[1]; let q1 = arguments[2]; let q2 = arguments[3]
    var px = p1.y - p2.y
    var py = p2.x - p1.x
    var pw = p1.x * p2.y - p2.x * p1.y
    var qx = q1.y - q2.y
    var qy = q2.x - q1.x
    var qw = q1.x * q2.y - q2.x * q1.y
    this.x = py * qw - qy * pw
    this.y = qx * pw - px * qw
    this.w = px * qy - qx * py
  }
}
