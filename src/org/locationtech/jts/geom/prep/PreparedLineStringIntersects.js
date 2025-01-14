import PointLocator from '../../algorithm/PointLocator'
import SegmentStringUtil from '../../noding/SegmentStringUtil'
import ComponentCoordinateExtracter from '../util/ComponentCoordinateExtracter'
export default class PreparedLineStringIntersects {
  constructor () {
    PreparedLineStringIntersects.constructor_.apply(this, arguments)
  }
  static intersects (prep, geom) {
    var op = new PreparedLineStringIntersects(prep)
    return op.intersects(geom)
  }
  isAnyTestPointInTarget (testGeom) {
    var locator = new PointLocator()
    var coords = ComponentCoordinateExtracter.getCoordinates(testGeom)
    for (var i = coords.iterator(); i.hasNext();) {
      var p = i.next()
      if (locator.intersects(p, this._prepLine.getGeometry())) return true
    }
    return false
  }
  intersects (geom) {
    var lineSegStr = SegmentStringUtil.extractSegmentStrings(geom)
    if (lineSegStr.size() > 0) {
      var segsIntersect = this._prepLine.getIntersectionFinder().intersects(lineSegStr)
      if (segsIntersect) return true
    }
    if (geom.getDimension() === 1) return false
    if (geom.getDimension() === 2 && this._prepLine.isAnyTargetComponentInTest(geom)) return true
    if (geom.getDimension() === 0) return this.isAnyTestPointInTarget(geom)
    return false
  }
  getClass () {
    return PreparedLineStringIntersects
  }
  get interfaces_ () {
    return []
  }
}
PreparedLineStringIntersects.constructor_ = function () {
  this._prepLine = null
  let prepLine = arguments[0]
  this._prepLine = prepLine
}
