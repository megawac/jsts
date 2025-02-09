import LineString from '../LineString'
import Geometry from '../Geometry'
import hasInterface from '../../../../../hasInterface'
import Collection from '../../../../../java/util/Collection'
import LinearRing from '../LinearRing'
import GeometryComponentFilter from '../GeometryComponentFilter'
import ArrayList from '../../../../../java/util/ArrayList'
export default class LinearComponentExtracter {
  constructor () {
    LinearComponentExtracter.constructor_.apply(this, arguments)
  }
  static getGeometry () {
    if (arguments.length === 1) {
      let geom = arguments[0]
      return geom.getFactory().buildGeometry(LinearComponentExtracter.getLines(geom))
    } else if (arguments.length === 2) {
      let geom = arguments[0]; let forceToLineString = arguments[1]
      return geom.getFactory().buildGeometry(LinearComponentExtracter.getLines(geom, forceToLineString))
    }
  }
  static getLines () {
    if (arguments.length === 1) {
      let geom = arguments[0]
      return LinearComponentExtracter.getLines(geom, false)
    } else if (arguments.length === 2) {
      if (hasInterface(arguments[0], Collection) && hasInterface(arguments[1], Collection)) {
        let geoms = arguments[0]; let lines = arguments[1]
        for (var i = geoms.iterator(); i.hasNext();) {
          var g = i.next()
          LinearComponentExtracter.getLines(g, lines)
        }
        return lines
      } else if (arguments[0] instanceof Geometry && typeof arguments[1] === 'boolean') {
        let geom = arguments[0]; let forceToLineString = arguments[1]
        var lines = new ArrayList()
        geom.apply(new LinearComponentExtracter(lines, forceToLineString))
        return lines
      } else if (arguments[0] instanceof Geometry && hasInterface(arguments[1], Collection)) {
        let geom = arguments[0]; let lines = arguments[1]
        if (geom instanceof LineString) {
          lines.add(geom)
        } else {
          geom.apply(new LinearComponentExtracter(lines))
        }
        return lines
      }
    } else if (arguments.length === 3) {
      if (typeof arguments[2] === 'boolean' && (hasInterface(arguments[0], Collection) && hasInterface(arguments[1], Collection))) {
        let geoms = arguments[0]; let lines = arguments[1]; let forceToLineString = arguments[2]
        for (var i = geoms.iterator(); i.hasNext();) {
          var g = i.next()
          LinearComponentExtracter.getLines(g, lines, forceToLineString)
        }
        return lines
      } else if (typeof arguments[2] === 'boolean' && (arguments[0] instanceof Geometry && hasInterface(arguments[1], Collection))) {
        let geom = arguments[0]; let lines = arguments[1]; let forceToLineString = arguments[2]
        geom.apply(new LinearComponentExtracter(lines, forceToLineString))
        return lines
      }
    }
  }
  filter (geom) {
    if (this._isForcedToLineString && geom instanceof LinearRing) {
      var line = geom.getFactory().createLineString(geom.getCoordinateSequence())
      this._lines.add(line)
      return null
    }
    if (geom instanceof LineString) this._lines.add(geom)
  }
  setForceToLineString (isForcedToLineString) {
    this._isForcedToLineString = isForcedToLineString
  }
  getClass () {
    return LinearComponentExtracter
  }
  get interfaces_ () {
    return [GeometryComponentFilter]
  }
}
LinearComponentExtracter.constructor_ = function () {
  this._lines = null
  this._isForcedToLineString = false
  if (arguments.length === 1) {
    let lines = arguments[0]
    this._lines = lines
  } else if (arguments.length === 2) {
    let lines = arguments[0]; let isForcedToLineString = arguments[1]
    this._lines = lines
    this._isForcedToLineString = isForcedToLineString
  }
}
