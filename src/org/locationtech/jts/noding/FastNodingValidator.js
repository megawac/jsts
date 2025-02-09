import WKTWriter from '../io/WKTWriter'
import MCIndexNoder from './MCIndexNoder'
import TopologyException from '../geom/TopologyException'
import RobustLineIntersector from '../algorithm/RobustLineIntersector'
import InteriorIntersectionFinder from './InteriorIntersectionFinder'
export default class FastNodingValidator {
  constructor () {
    FastNodingValidator.constructor_.apply(this, arguments)
  }
  static computeIntersections (segStrings) {
    var nv = new FastNodingValidator(segStrings)
    nv.setFindAllIntersections(true)
    nv.isValid()
    return nv.getIntersections()
  }
  execute () {
    if (this._segInt !== null) return null
    this.checkInteriorIntersections()
  }
  getIntersections () {
    return this._segInt.getIntersections()
  }
  isValid () {
    this.execute()
    return this._isValid
  }
  setFindAllIntersections (findAllIntersections) {
    this._findAllIntersections = findAllIntersections
  }
  checkInteriorIntersections () {
    this._isValid = true
    this._segInt = new InteriorIntersectionFinder(this._li)
    this._segInt.setFindAllIntersections(this._findAllIntersections)
    var noder = new MCIndexNoder()
    noder.setSegmentIntersector(this._segInt)
    noder.computeNodes(this._segStrings)
    if (this._segInt.hasIntersection()) {
      this._isValid = false
      return null
    }
  }
  checkValid () {
    this.execute()
    if (!this._isValid) throw new TopologyException(this.getErrorMessage(), this._segInt.getInteriorIntersection())
  }
  getErrorMessage () {
    if (this._isValid) return 'no intersections found'
    var intSegs = this._segInt.getIntersectionSegments()
    return 'found non-noded intersection between ' + WKTWriter.toLineString(intSegs[0], intSegs[1]) + ' and ' + WKTWriter.toLineString(intSegs[2], intSegs[3])
  }
  getClass () {
    return FastNodingValidator
  }
  get interfaces_ () {
    return []
  }
}
FastNodingValidator.constructor_ = function () {
  this._li = new RobustLineIntersector()
  this._segStrings = null
  this._findAllIntersections = false
  this._segInt = null
  this._isValid = true
  let segStrings = arguments[0]
  this._segStrings = segStrings
}
