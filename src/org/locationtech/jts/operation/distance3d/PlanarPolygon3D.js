import Location from '../../geom/Location'
import hasInterface from '../../../../../hasInterface'
import Coordinate from '../../geom/Coordinate'
import AxisPlaneCoordinateSequence from './AxisPlaneCoordinateSequence'
import Vector3D from '../../math/Vector3D'
import CoordinateSequence from '../../geom/CoordinateSequence'
import Plane3D from '../../math/Plane3D'
import RayCrossingCounter from '../../algorithm/RayCrossingCounter'
export default class PlanarPolygon3D {
  constructor () {
    PlanarPolygon3D.constructor_.apply(this, arguments)
  }
  static project () {
    if (hasInterface(arguments[0], CoordinateSequence) && Number.isInteger(arguments[1])) {
      let seq = arguments[0]; let facingPlane = arguments[1]
      switch (facingPlane) {
        case Plane3D.XY_PLANE:
          return AxisPlaneCoordinateSequence.projectToXY(seq)
        case Plane3D.XZ_PLANE:
          return AxisPlaneCoordinateSequence.projectToXZ(seq)
        default:
          return AxisPlaneCoordinateSequence.projectToYZ(seq)
      }
    } else if (arguments[0] instanceof Coordinate && Number.isInteger(arguments[1])) {
      let p = arguments[0]; let facingPlane = arguments[1]
      switch (facingPlane) {
        case Plane3D.XY_PLANE:
          return new Coordinate(p.x, p.y)
        case Plane3D.XZ_PLANE:
          return new Coordinate(p.x, p.z)
        default:
          return new Coordinate(p.y, p.z)
      }
    }
  }
  intersects () {
    if (arguments.length === 1) {
      let intPt = arguments[0]
      if (Location.EXTERIOR === this.locate(intPt, this._poly.getExteriorRing())) return false
      for (var i = 0; i < this._poly.getNumInteriorRing(); i++) {
        if (Location.INTERIOR === this.locate(intPt, this._poly.getInteriorRingN(i))) return false
      }
      return true
    } else if (arguments.length === 2) {
      let pt = arguments[0]; let ring = arguments[1]
      var seq = ring.getCoordinateSequence()
      var seqProj = PlanarPolygon3D.project(seq, this._facingPlane)
      var ptProj = PlanarPolygon3D.project(pt, this._facingPlane)
      return Location.EXTERIOR !== RayCrossingCounter.locatePointInRing(ptProj, seqProj)
    }
  }
  averagePoint (seq) {
    var a = new Coordinate(0, 0, 0)
    var n = seq.size()
    for (var i = 0; i < n; i++) {
      a.x += seq.getOrdinate(i, CoordinateSequence.X)
      a.y += seq.getOrdinate(i, CoordinateSequence.Y)
      a.z += seq.getOrdinate(i, CoordinateSequence.Z)
    }
    a.x /= n
    a.y /= n
    a.z /= n
    return a
  }
  getPolygon () {
    return this._poly
  }
  getPlane () {
    return this._plane
  }
  findBestFitPlane (poly) {
    var seq = poly.getExteriorRing().getCoordinateSequence()
    var basePt = this.averagePoint(seq)
    var normal = this.averageNormal(seq)
    return new Plane3D(normal, basePt)
  }
  averageNormal (seq) {
    var n = seq.size()
    var sum = new Coordinate(0, 0, 0)
    var p1 = new Coordinate(0, 0, 0)
    var p2 = new Coordinate(0, 0, 0)
    for (var i = 0; i < n - 1; i++) {
      seq.getCoordinate(i, p1)
      seq.getCoordinate(i + 1, p2)
      sum.x += (p1.y - p2.y) * (p1.z + p2.z)
      sum.y += (p1.z - p2.z) * (p1.x + p2.x)
      sum.z += (p1.x - p2.x) * (p1.y + p2.y)
    }
    sum.x /= n
    sum.y /= n
    sum.z /= n
    var norm = Vector3D.create(sum).normalize()
    return norm
  }
  locate (pt, ring) {
    var seq = ring.getCoordinateSequence()
    var seqProj = PlanarPolygon3D.project(seq, this._facingPlane)
    var ptProj = PlanarPolygon3D.project(pt, this._facingPlane)
    return RayCrossingCounter.locatePointInRing(ptProj, seqProj)
  }
  getClass () {
    return PlanarPolygon3D
  }
  get interfaces_ () {
    return []
  }
}
PlanarPolygon3D.constructor_ = function () {
  this._plane = null
  this._poly = null
  this._facingPlane = -1
  let poly = arguments[0]
  this._poly = poly
  this._plane = this.findBestFitPlane(poly)
  this._facingPlane = this._plane.closestAxisPlane()
}
