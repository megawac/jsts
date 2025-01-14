import IllegalArgumentException from '../../../../java/lang/IllegalArgumentException'
import Double from '../../../../java/lang/Double'
import Vector3D from './Vector3D'
export default class Plane3D {
  constructor () {
    Plane3D.constructor_.apply(this, arguments)
  }
  closestAxisPlane () {
    var xmag = Math.abs(this._normal.getX())
    var ymag = Math.abs(this._normal.getY())
    var zmag = Math.abs(this._normal.getZ())
    if (xmag > ymag) {
      if (xmag > zmag) return Plane3D.YZ_PLANE; else return Plane3D.XY_PLANE
    } else if (zmag > ymag) {
      return Plane3D.XY_PLANE
    }
    return Plane3D.XZ_PLANE
  }
  orientedDistance (p) {
    var pb = new Vector3D(p, this._basePt)
    var pbdDotNormal = pb.dot(this._normal)
    if (Double.isNaN(pbdDotNormal)) throw new IllegalArgumentException('3D Coordinate has NaN ordinate')
    var d = pbdDotNormal / this._normal.length()
    return d
  }
  getClass () {
    return Plane3D
  }
  get interfaces_ () {
    return []
  }
}
Plane3D.constructor_ = function () {
  this._normal = null
  this._basePt = null
  let normal = arguments[0]; let basePt = arguments[1]
  this._normal = normal
  this._basePt = basePt
}
Plane3D.XY_PLANE = 1
Plane3D.YZ_PLANE = 2
Plane3D.XZ_PLANE = 3
