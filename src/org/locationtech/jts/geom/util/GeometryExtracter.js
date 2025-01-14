import Geometry from '../Geometry'
import hasInterface from '../../../../../hasInterface'
import GeometryCollection from '../GeometryCollection'
import ArrayList from '../../../../../java/util/ArrayList'
import GeometryFilter from '../GeometryFilter'
import List from '../../../../../java/util/List'
export default class GeometryExtracter {
  constructor () {
    GeometryExtracter.constructor_.apply(this, arguments)
  }
  static isOfType (geom, geometryType) {
    if (geom.getGeometryType() === geometryType) return true
    if (geometryType === Geometry.TYPENAME_LINESTRING && geom.getGeometryType() === Geometry.TYPENAME_LINEARRING) return true
    return false
  }
  static extract () {
    if (arguments.length === 2) {
      let geom = arguments[0]; let geometryType = arguments[1]
      return GeometryExtracter.extract(geom, geometryType, new ArrayList())
    } else if (arguments.length === 3) {
      if (hasInterface(arguments[2], List) && (arguments[0] instanceof Geometry && typeof arguments[1] === 'string')) {
        let geom = arguments[0]; let geometryType = arguments[1]; let list = arguments[2]
        if (geom.getGeometryType() === geometryType) {
          list.add(geom)
        } else if (geom instanceof GeometryCollection) {
          geom.apply(new GeometryExtracter(geometryType, list))
        }
        return list
      } else if (hasInterface(arguments[2], List) && (arguments[0] instanceof Geometry && arguments[1] instanceof Class)) {
        let geom = arguments[0]; let clz = arguments[1]; let list = arguments[2]
        return GeometryExtracter.extract(geom, GeometryExtracter.toGeometryType(clz), list)
      }
    }
  }
  filter (geom) {
    if (this._geometryType === null || GeometryExtracter.isOfType(geom, this._geometryType)) this._comps.add(geom)
  }
  getClass () {
    return GeometryExtracter
  }
  get interfaces_ () {
    return [GeometryFilter]
  }
}
GeometryExtracter.constructor_ = function () {
  this._geometryType = null
  this._comps = null
  let geometryType = arguments[0]; let comps = arguments[1]
  this._geometryType = geometryType
  this._comps = comps
}
