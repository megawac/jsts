import LineString from '../../../geom/LineString'
import Geometry from '../../../geom/Geometry'
import Coordinate from '../../../geom/Coordinate'
import Polygon from '../../../geom/Polygon'
import LineSegment from '../../../geom/LineSegment'
import PointPairDistance from './PointPairDistance'
import GeometryCollection from '../../../geom/GeometryCollection'
export default class DistanceToPointFinder {
  constructor () {
    DistanceToPointFinder.constructor_.apply(this, arguments)
  }
  static computeDistance () {
    if (arguments[2] instanceof PointPairDistance && (arguments[0] instanceof LineString && arguments[1] instanceof Coordinate)) {
      let line = arguments[0]; let pt = arguments[1]; let ptDist = arguments[2]
      var coords = line.getCoordinates()
      var tempSegment = new LineSegment()
      for (var i = 0; i < coords.length - 1; i++) {
        tempSegment.setCoordinates(coords[i], coords[i + 1])
        var closestPt = tempSegment.closestPoint(pt)
        ptDist.setMinimum(closestPt, pt)
      }
    } else if (arguments[2] instanceof PointPairDistance && (arguments[0] instanceof Polygon && arguments[1] instanceof Coordinate)) {
      let poly = arguments[0]; let pt = arguments[1]; let ptDist = arguments[2]
      DistanceToPointFinder.computeDistance(poly.getExteriorRing(), pt, ptDist)
      for (var i = 0; i < poly.getNumInteriorRing(); i++) {
        DistanceToPointFinder.computeDistance(poly.getInteriorRingN(i), pt, ptDist)
      }
    } else if (arguments[2] instanceof PointPairDistance && (arguments[0] instanceof Geometry && arguments[1] instanceof Coordinate)) {
      let geom = arguments[0]; let pt = arguments[1]; let ptDist = arguments[2]
      if (geom instanceof LineString) {
        DistanceToPointFinder.computeDistance(geom, pt, ptDist)
      } else if (geom instanceof Polygon) {
        DistanceToPointFinder.computeDistance(geom, pt, ptDist)
      } else if (geom instanceof GeometryCollection) {
        var gc = geom
        for (var i = 0; i < gc.getNumGeometries(); i++) {
          var g = gc.getGeometryN(i)
          DistanceToPointFinder.computeDistance(g, pt, ptDist)
        }
      } else {
        ptDist.setMinimum(geom.getCoordinate(), pt)
      }
    } else if (arguments[2] instanceof PointPairDistance && (arguments[0] instanceof LineSegment && arguments[1] instanceof Coordinate)) {
      let segment = arguments[0]; let pt = arguments[1]; let ptDist = arguments[2]
      var closestPt = segment.closestPoint(pt)
      ptDist.setMinimum(closestPt, pt)
    }
  }
  getClass () {
    return DistanceToPointFinder
  }
  get interfaces_ () {
    return []
  }
}
DistanceToPointFinder.constructor_ = function () {}
