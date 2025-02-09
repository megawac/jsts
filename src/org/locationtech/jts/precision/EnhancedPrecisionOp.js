import CommonBitsOp from './CommonBitsOp'
import RuntimeException from '../../../../java/lang/RuntimeException'
export default class EnhancedPrecisionOp {
  constructor () {
    EnhancedPrecisionOp.constructor_.apply(this, arguments)
  }
  static union (geom0, geom1) {
    var originalEx = null
    try {
      var result = geom0.union(geom1)
      return result
    } catch (ex) {
      if (ex instanceof RuntimeException) {
        originalEx = ex
      } else throw ex
    } finally {}
    try {
      var cbo = new CommonBitsOp(true)
      var resultEP = cbo.union(geom0, geom1)
      if (!resultEP.isValid()) throw originalEx
      return resultEP
    } catch (ex2) {
      if (ex2 instanceof RuntimeException) {
        throw originalEx
      } else throw ex2
    } finally {}
  }
  static intersection (geom0, geom1) {
    var originalEx = null
    try {
      var result = geom0.intersection(geom1)
      return result
    } catch (ex) {
      if (ex instanceof RuntimeException) {
        originalEx = ex
      } else throw ex
    } finally {}
    try {
      var cbo = new CommonBitsOp(true)
      var resultEP = cbo.intersection(geom0, geom1)
      if (!resultEP.isValid()) throw originalEx
      return resultEP
    } catch (ex2) {
      if (ex2 instanceof RuntimeException) {
        throw originalEx
      } else throw ex2
    } finally {}
  }
  static buffer (geom, distance) {
    var originalEx = null
    try {
      var result = geom.buffer(distance)
      return result
    } catch (ex) {
      if (ex instanceof RuntimeException) {
        originalEx = ex
      } else throw ex
    } finally {}
    try {
      var cbo = new CommonBitsOp(true)
      var resultEP = cbo.buffer(geom, distance)
      if (!resultEP.isValid()) throw originalEx
      return resultEP
    } catch (ex2) {
      if (ex2 instanceof RuntimeException) {
        throw originalEx
      } else throw ex2
    } finally {}
  }
  static symDifference (geom0, geom1) {
    var originalEx = null
    try {
      var result = geom0.symDifference(geom1)
      return result
    } catch (ex) {
      if (ex instanceof RuntimeException) {
        originalEx = ex
      } else throw ex
    } finally {}
    try {
      var cbo = new CommonBitsOp(true)
      var resultEP = cbo.symDifference(geom0, geom1)
      if (!resultEP.isValid()) throw originalEx
      return resultEP
    } catch (ex2) {
      if (ex2 instanceof RuntimeException) {
        throw originalEx
      } else throw ex2
    } finally {}
  }
  static difference (geom0, geom1) {
    var originalEx = null
    try {
      var result = geom0.difference(geom1)
      return result
    } catch (ex) {
      if (ex instanceof RuntimeException) {
        originalEx = ex
      } else throw ex
    } finally {}
    try {
      var cbo = new CommonBitsOp(true)
      var resultEP = cbo.difference(geom0, geom1)
      if (!resultEP.isValid()) throw originalEx
      return resultEP
    } catch (ex2) {
      if (ex2 instanceof RuntimeException) {
        throw originalEx
      } else throw ex2
    } finally {}
  }
  getClass () {
    return EnhancedPrecisionOp
  }
  get interfaces_ () {
    return []
  }
}
EnhancedPrecisionOp.constructor_ = function () {}
