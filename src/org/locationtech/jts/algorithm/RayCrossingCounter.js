import Location from '../geom/Location'
import hasInterface from '../../../../hasInterface'
import Coordinate from '../geom/Coordinate'
import Orientation from './Orientation'
import CoordinateSequence from '../geom/CoordinateSequence'
export default class RayCrossingCounter {
  constructor () {
    RayCrossingCounter.constructor_.apply(this, arguments)
  }
  static locatePointInRing () {
    if (arguments[0] instanceof Coordinate && hasInterface(arguments[1], CoordinateSequence)) {
      let p = arguments[0]; let ring = arguments[1]
      var counter = new RayCrossingCounter(p)
      var p1 = new Coordinate()
      var p2 = new Coordinate()
      for (var i = 1; i < ring.size(); i++) {
        ring.getCoordinate(i, p1)
        ring.getCoordinate(i - 1, p2)
        counter.countSegment(p1, p2)
        if (counter.isOnSegment()) return counter.getLocation()
      }
      return counter.getLocation()
    } else if (arguments[0] instanceof Coordinate && arguments[1] instanceof Array) {
      let p = arguments[0]; let ring = arguments[1]
      var counter = new RayCrossingCounter(p)
      for (var i = 1; i < ring.length; i++) {
        var p1 = ring[i]
        var p2 = ring[i - 1]
        counter.countSegment(p1, p2)
        if (counter.isOnSegment()) return counter.getLocation()
      }
      return counter.getLocation()
    }
  }
  countSegment (p1, p2) {
    if (p1.x < this._p.x && p2.x < this._p.x) return null
    if (this._p.x === p2.x && this._p.y === p2.y) {
      this._isPointOnSegment = true
      return null
    }
    if (p1.y === this._p.y && p2.y === this._p.y) {
      var minx = p1.x
      var maxx = p2.x
      if (minx > maxx) {
        minx = p2.x
        maxx = p1.x
      }
      if (this._p.x >= minx && this._p.x <= maxx) {
        this._isPointOnSegment = true
      }
      return null
    }
    if (p1.y > this._p.y && p2.y <= this._p.y || p2.y > this._p.y && p1.y <= this._p.y) {
      var orient = Orientation.index(p1, p2, this._p)
      if (orient === Orientation.COLLINEAR) {
        this._isPointOnSegment = true
        return null
      }
      if (p2.y < p1.y) {
        orient = -orient
      }
      if (orient === Orientation.LEFT) {
        this._crossingCount++
      }
    }
  }
  isPointInPolygon () {
    return this.getLocation() !== Location.EXTERIOR
  }
  getLocation () {
    if (this._isPointOnSegment) return Location.BOUNDARY
    if (this._crossingCount % 2 === 1) {
      return Location.INTERIOR
    }
    return Location.EXTERIOR
  }
  isOnSegment () {
    return this._isPointOnSegment
  }
  getClass () {
    return RayCrossingCounter
  }
  get interfaces_ () {
    return []
  }
}
RayCrossingCounter.constructor_ = function () {
  this._p = null
  this._crossingCount = 0
  this._isPointOnSegment = false
  let p = arguments[0]
  this._p = p
}
