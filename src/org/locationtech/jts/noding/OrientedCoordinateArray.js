import Comparable from '../../../../java/lang/Comparable'
import CoordinateArrays from '../geom/CoordinateArrays'
export default class OrientedCoordinateArray {
  constructor () {
    OrientedCoordinateArray.constructor_.apply(this, arguments)
  }
  static orientation (pts) {
    return CoordinateArrays.increasingDirection(pts) === 1
  }
  static compareOriented (pts1, orientation1, pts2, orientation2) {
    var dir1 = orientation1 ? 1 : -1
    var dir2 = orientation2 ? 1 : -1
    var limit1 = orientation1 ? pts1.length : -1
    var limit2 = orientation2 ? pts2.length : -1
    var i1 = orientation1 ? 0 : pts1.length - 1
    var i2 = orientation2 ? 0 : pts2.length - 1
    var comp = 0
    while (true) {
      var compPt = pts1[i1].compareTo(pts2[i2])
      if (compPt !== 0) return compPt
      i1 += dir1
      i2 += dir2
      var done1 = i1 === limit1
      var done2 = i2 === limit2
      if (done1 && !done2) return -1
      if (!done1 && done2) return 1
      if (done1 && done2) return 0
    }
  }
  compareTo (o1) {
    var oca = o1
    var comp = OrientedCoordinateArray.compareOriented(this._pts, this._orientation, oca._pts, oca._orientation)
    return comp
  }
  getClass () {
    return OrientedCoordinateArray
  }
  get interfaces_ () {
    return [Comparable]
  }
}
OrientedCoordinateArray.constructor_ = function () {
  this._pts = null
  this._orientation = null
  let pts = arguments[0]
  this._pts = pts
  this._orientation = OrientedCoordinateArray.orientation(pts)
}
