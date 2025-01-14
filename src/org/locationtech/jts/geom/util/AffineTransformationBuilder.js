import AffineTransformation from './AffineTransformation'
import Matrix from '../../math/Matrix'
export default class AffineTransformationBuilder {
  constructor () {
    AffineTransformationBuilder.constructor_.apply(this, arguments)
  }
  solve (b) {
    var a = [[this._src0.x, this._src0.y, 1], [this._src1.x, this._src1.y, 1], [this._src2.x, this._src2.y, 1]]
    return Matrix.solve(a, b)
  }
  compute () {
    var bx = [this._dest0.x, this._dest1.x, this._dest2.x]
    var row0 = this.solve(bx)
    if (row0 === null) return false
    this._m00 = row0[0]
    this._m01 = row0[1]
    this._m02 = row0[2]
    var by = [this._dest0.y, this._dest1.y, this._dest2.y]
    var row1 = this.solve(by)
    if (row1 === null) return false
    this._m10 = row1[0]
    this._m11 = row1[1]
    this._m12 = row1[2]
    return true
  }
  getTransformation () {
    var isSolvable = this.compute()
    if (isSolvable) return new AffineTransformation(this._m00, this._m01, this._m02, this._m10, this._m11, this._m12)
    return null
  }
  getClass () {
    return AffineTransformationBuilder
  }
  get interfaces_ () {
    return []
  }
}
AffineTransformationBuilder.constructor_ = function () {
  this._src0 = null
  this._src1 = null
  this._src2 = null
  this._dest0 = null
  this._dest1 = null
  this._dest2 = null
  this._m00 = null
  this._m01 = null
  this._m02 = null
  this._m10 = null
  this._m11 = null
  this._m12 = null
  let src0 = arguments[0]; let src1 = arguments[1]; let src2 = arguments[2]; let dest0 = arguments[3]; let dest1 = arguments[4]; let dest2 = arguments[5]
  this._src0 = src0
  this._src1 = src1
  this._src2 = src2
  this._dest0 = dest0
  this._dest1 = dest1
  this._dest2 = dest2
}
