import SplitSegment from './SplitSegment'
import ConstraintSplitPointFinder from './ConstraintSplitPointFinder'
export default class NonEncroachingSplitPointFinder {
  constructor () {
    NonEncroachingSplitPointFinder.constructor_.apply(this, arguments)
  }
  static projectedSplitPoint (seg, encroachPt) {
    var lineSeg = seg.getLineSegment()
    var projPt = lineSeg.project(encroachPt)
    return projPt
  }
  findSplitPoint (seg, encroachPt) {
    var lineSeg = seg.getLineSegment()
    var segLen = lineSeg.getLength()
    var midPtLen = segLen / 2
    var splitSeg = new SplitSegment(lineSeg)
    var projPt = NonEncroachingSplitPointFinder.projectedSplitPoint(seg, encroachPt)
    var nonEncroachDiam = projPt.distance(encroachPt) * 2 * 0.8
    var maxSplitLen = nonEncroachDiam
    if (maxSplitLen > midPtLen) {
      maxSplitLen = midPtLen
    }
    splitSeg.setMinimumLength(maxSplitLen)
    splitSeg.splitAt(projPt)
    return splitSeg.getSplitPoint()
  }
  getClass () {
    return NonEncroachingSplitPointFinder
  }
  get interfaces_ () {
    return [ConstraintSplitPointFinder]
  }
}
NonEncroachingSplitPointFinder.constructor_ = function () {}
