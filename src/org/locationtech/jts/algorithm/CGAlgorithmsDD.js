import Coordinate from '../geom/Coordinate'
import DD from '../math/DD'
export default class CGAlgorithmsDD {
  constructor () {
    CGAlgorithmsDD.constructor_.apply(this, arguments)
  }
  static orientationIndex (p1, p2, q) {
    var index = CGAlgorithmsDD.orientationIndexFilter(p1, p2, q)
    if (index <= 1) return index
    var dx1 = DD.valueOf(p2.x).selfAdd(-p1.x)
    var dy1 = DD.valueOf(p2.y).selfAdd(-p1.y)
    var dx2 = DD.valueOf(q.x).selfAdd(-p2.x)
    var dy2 = DD.valueOf(q.y).selfAdd(-p2.y)
    return dx1.selfMultiply(dy2).selfSubtract(dy1.selfMultiply(dx2)).signum()
  }
  static signOfDet2x2 () {
    if (arguments[3] instanceof DD && (arguments[2] instanceof DD && (arguments[0] instanceof DD && arguments[1] instanceof DD))) {
      let x1 = arguments[0]; let y1 = arguments[1]; let x2 = arguments[2]; let y2 = arguments[3]
      var det = x1.multiply(y2).selfSubtract(y1.multiply(x2))
      return det.signum()
    } else if (typeof arguments[3] === 'number' && (typeof arguments[2] === 'number' && (typeof arguments[0] === 'number' && typeof arguments[1] === 'number'))) {
      let dx1 = arguments[0]; let dy1 = arguments[1]; let dx2 = arguments[2]; let dy2 = arguments[3]
      var x1 = DD.valueOf(dx1)
      var y1 = DD.valueOf(dy1)
      var x2 = DD.valueOf(dx2)
      var y2 = DD.valueOf(dy2)
      var det = x1.multiply(y2).selfSubtract(y1.multiply(x2))
      return det.signum()
    }
  }
  static intersection (p1, p2, q1, q2) {
    var denom1 = DD.valueOf(q2.y).selfSubtract(q1.y).selfMultiply(DD.valueOf(p2.x).selfSubtract(p1.x))
    var denom2 = DD.valueOf(q2.x).selfSubtract(q1.x).selfMultiply(DD.valueOf(p2.y).selfSubtract(p1.y))
    var denom = denom1.subtract(denom2)
    var numx1 = DD.valueOf(q2.x).selfSubtract(q1.x).selfMultiply(DD.valueOf(p1.y).selfSubtract(q1.y))
    var numx2 = DD.valueOf(q2.y).selfSubtract(q1.y).selfMultiply(DD.valueOf(p1.x).selfSubtract(q1.x))
    var numx = numx1.subtract(numx2)
    var fracP = numx.selfDivide(denom).doubleValue()
    var x = DD.valueOf(p1.x).selfAdd(DD.valueOf(p2.x).selfSubtract(p1.x).selfMultiply(fracP)).doubleValue()
    var numy1 = DD.valueOf(p2.x).selfSubtract(p1.x).selfMultiply(DD.valueOf(p1.y).selfSubtract(q1.y))
    var numy2 = DD.valueOf(p2.y).selfSubtract(p1.y).selfMultiply(DD.valueOf(p1.x).selfSubtract(q1.x))
    var numy = numy1.subtract(numy2)
    var fracQ = numy.selfDivide(denom).doubleValue()
    var y = DD.valueOf(q1.y).selfAdd(DD.valueOf(q2.y).selfSubtract(q1.y).selfMultiply(fracQ)).doubleValue()
    return new Coordinate(x, y)
  }
  static orientationIndexFilter (pa, pb, pc) {
    var detsum = null
    var detleft = (pa.x - pc.x) * (pb.y - pc.y)
    var detright = (pa.y - pc.y) * (pb.x - pc.x)
    var det = detleft - detright
    if (detleft > 0.0) {
      if (detright <= 0.0) {
        return CGAlgorithmsDD.signum(det)
      } else {
        detsum = detleft + detright
      }
    } else if (detleft < 0.0) {
      if (detright >= 0.0) {
        return CGAlgorithmsDD.signum(det)
      } else {
        detsum = -detleft - detright
      }
    } else {
      return CGAlgorithmsDD.signum(det)
    }
    var errbound = CGAlgorithmsDD.DP_SAFE_EPSILON * detsum
    if (det >= errbound || -det >= errbound) {
      return CGAlgorithmsDD.signum(det)
    }
    return 2
  }
  static signum (x) {
    if (x > 0) return 1
    if (x < 0) return -1
    return 0
  }
  getClass () {
    return CGAlgorithmsDD
  }
  get interfaces_ () {
    return []
  }
}
CGAlgorithmsDD.constructor_ = function () {}
CGAlgorithmsDD.DP_SAFE_EPSILON = 1e-15
