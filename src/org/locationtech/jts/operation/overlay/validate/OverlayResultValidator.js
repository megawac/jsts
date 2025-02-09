import GeometrySnapper from '../snap/GeometrySnapper'
import Location from '../../../geom/Location'
import FuzzyPointLocator from './FuzzyPointLocator'
import OffsetPointGenerator from './OffsetPointGenerator'
import System from '../../../../../../java/lang/System'
import ArrayList from '../../../../../../java/util/ArrayList'
import OverlayOp from '../OverlayOp'
export default class OverlayResultValidator {
  constructor () {
    OverlayResultValidator.constructor_.apply(this, arguments)
  }
  static hasLocation (location, loc) {
    for (var i = 0; i < 3; i++) {
      if (location[i] === loc) return true
    }
    return false
  }
  static computeBoundaryDistanceTolerance (g0, g1) {
    return Math.min(GeometrySnapper.computeSizeBasedSnapTolerance(g0), GeometrySnapper.computeSizeBasedSnapTolerance(g1))
  }
  static isValid (a, b, overlayOp, result) {
    var validator = new OverlayResultValidator(a, b, result)
    return validator.isValid(overlayOp)
  }
  reportResult (overlayOp, location, expectedInterior) {
    System.out.println('Overlay result invalid - A:' + Location.toLocationSymbol(location[0]) + ' B:' + Location.toLocationSymbol(location[1]) + ' expected:' + (expectedInterior ? 'i' : 'e') + ' actual:' + Location.toLocationSymbol(location[2]))
  }
  isValid (overlayOp) {
    this.addTestPts(this._geom[0])
    this.addTestPts(this._geom[1])
    var isValid = this.checkValid(overlayOp)
    return isValid
  }
  checkValid () {
    if (arguments.length === 1) {
      let overlayOp = arguments[0]
      for (var i = 0; i < this._testCoords.size(); i++) {
        var pt = this._testCoords.get(i)
        if (!this.checkValid(overlayOp, pt)) {
          this._invalidLocation = pt
          return false
        }
      }
      return true
    } else if (arguments.length === 2) {
      let overlayOp = arguments[0]; let pt = arguments[1]
      this._location[0] = this._locFinder[0].getLocation(pt)
      this._location[1] = this._locFinder[1].getLocation(pt)
      this._location[2] = this._locFinder[2].getLocation(pt)
      if (OverlayResultValidator.hasLocation(this._location, Location.BOUNDARY)) return true
      return this.isValidResult(overlayOp, this._location)
    }
  }
  addTestPts (g) {
    var ptGen = new OffsetPointGenerator(g)
    this._testCoords.addAll(ptGen.getPoints(5 * this._boundaryDistanceTolerance))
  }
  isValidResult (overlayOp, location) {
    var expectedInterior = OverlayOp.isResultOfOp(location[0], location[1], overlayOp)
    var resultInInterior = location[2] === Location.INTERIOR
    var isValid = !(expectedInterior ^ resultInInterior)
    if (!isValid) this.reportResult(overlayOp, location, expectedInterior)
    return isValid
  }
  getInvalidLocation () {
    return this._invalidLocation
  }
  getClass () {
    return OverlayResultValidator
  }
  get interfaces_ () {
    return []
  }
}
OverlayResultValidator.constructor_ = function () {
  this._geom = null
  this._locFinder = null
  this._location = new Array(3).fill(null)
  this._invalidLocation = null
  this._boundaryDistanceTolerance = OverlayResultValidator.TOLERANCE
  this._testCoords = new ArrayList()
  let a = arguments[0]; let b = arguments[1]; let result = arguments[2]
  this._boundaryDistanceTolerance = OverlayResultValidator.computeBoundaryDistanceTolerance(a, b)
  this._geom = [a, b, result]
  this._locFinder = [new FuzzyPointLocator(this._geom[0], this._boundaryDistanceTolerance), new FuzzyPointLocator(this._geom[1], this._boundaryDistanceTolerance), new FuzzyPointLocator(this._geom[2], this._boundaryDistanceTolerance)]
}
OverlayResultValidator.TOLERANCE = 0.000001
