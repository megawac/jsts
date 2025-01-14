import Coordinate from '../geom/Coordinate'
import IllegalArgumentException from '../../../../java/lang/IllegalArgumentException'
export default class Octant {
  constructor () {
    Octant.constructor_.apply(this, arguments)
  }
  static octant () {
    if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      let dx = arguments[0]; let dy = arguments[1]
      if (dx === 0.0 && dy === 0.0) throw new IllegalArgumentException('Cannot compute the octant for point ( ' + dx + ', ' + dy + ' )')
      var adx = Math.abs(dx)
      var ady = Math.abs(dy)
      if (dx >= 0) {
        if (dy >= 0) {
          if (adx >= ady) return 0; else return 1
        } else {
          if (adx >= ady) return 7; else return 6
        }
      } else {
        if (dy >= 0) {
          if (adx >= ady) return 3; else return 2
        } else {
          if (adx >= ady) return 4; else return 5
        }
      }
    } else if (arguments[0] instanceof Coordinate && arguments[1] instanceof Coordinate) {
      let p0 = arguments[0]; let p1 = arguments[1]
      var dx = p1.x - p0.x
      var dy = p1.y - p0.y
      if (dx === 0.0 && dy === 0.0) throw new IllegalArgumentException('Cannot compute the octant for two identical points ' + p0)
      return Octant.octant(dx, dy)
    }
  }
  getClass () {
    return Octant
  }
  get interfaces_ () {
    return []
  }
}
Octant.constructor_ = function () {}
