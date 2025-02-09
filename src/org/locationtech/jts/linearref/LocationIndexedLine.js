import LineString from '../geom/LineString'
import IllegalArgumentException from '../../../../java/lang/IllegalArgumentException'
import LinearLocation from './LinearLocation'
import LocationIndexOfPoint from './LocationIndexOfPoint'
import LocationIndexOfLine from './LocationIndexOfLine'
import ExtractLineByLocation from './ExtractLineByLocation'
import MultiLineString from '../geom/MultiLineString'
export default class LocationIndexedLine {
  constructor () {
    LocationIndexedLine.constructor_.apply(this, arguments)
  }
  clampIndex (index) {
    var loc = index.copy()
    loc.clamp(this._linearGeom)
    return loc
  }
  project (pt) {
    return LocationIndexOfPoint.indexOf(this._linearGeom, pt)
  }
  checkGeometryType () {
    if (!(this._linearGeom instanceof LineString || this._linearGeom instanceof MultiLineString)) throw new IllegalArgumentException('Input geometry must be linear')
  }
  extractPoint () {
    if (arguments.length === 1) {
      let index = arguments[0]
      return index.getCoordinate(this._linearGeom)
    } else if (arguments.length === 2) {
      let index = arguments[0]; let offsetDistance = arguments[1]
      var indexLow = index.toLowest(this._linearGeom)
      return indexLow.getSegment(this._linearGeom).pointAlongOffset(indexLow.getSegmentFraction(), offsetDistance)
    }
  }
  isValidIndex (index) {
    return index.isValid(this._linearGeom)
  }
  getEndIndex () {
    return LinearLocation.getEndLocation(this._linearGeom)
  }
  getStartIndex () {
    return new LinearLocation()
  }
  indexOfAfter (pt, minIndex) {
    return LocationIndexOfPoint.indexOfAfter(this._linearGeom, pt, minIndex)
  }
  extractLine (startIndex, endIndex) {
    return ExtractLineByLocation.extract(this._linearGeom, startIndex, endIndex)
  }
  indexOf (pt) {
    return LocationIndexOfPoint.indexOf(this._linearGeom, pt)
  }
  indicesOf (subLine) {
    return LocationIndexOfLine.indicesOf(this._linearGeom, subLine)
  }
  getClass () {
    return LocationIndexedLine
  }
  get interfaces_ () {
    return []
  }
}
LocationIndexedLine.constructor_ = function () {
  this._linearGeom = null
  let linearGeom = arguments[0]
  this._linearGeom = linearGeom
  this.checkGeometryType()
}
