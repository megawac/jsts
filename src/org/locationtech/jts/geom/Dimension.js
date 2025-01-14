import IllegalArgumentException from '../../../../java/lang/IllegalArgumentException'
import Character from '../../../../java/lang/Character'
export default class Dimension {
  constructor () {
    Dimension.constructor_.apply(this, arguments)
  }
  static toDimensionSymbol (dimensionValue) {
    switch (dimensionValue) {
      case Dimension.FALSE:
        return Dimension.SYM_FALSE
      case Dimension.TRUE:
        return Dimension.SYM_TRUE
      case Dimension.DONTCARE:
        return Dimension.SYM_DONTCARE
      case Dimension.P:
        return Dimension.SYM_P
      case Dimension.L:
        return Dimension.SYM_L
      case Dimension.A:
        return Dimension.SYM_A
    }
    throw new IllegalArgumentException('Unknown dimension value: ' + dimensionValue)
  }
  static toDimensionValue (dimensionSymbol) {
    switch (Character.toUpperCase(dimensionSymbol)) {
      case Dimension.SYM_FALSE:
        return Dimension.FALSE
      case Dimension.SYM_TRUE:
        return Dimension.TRUE
      case Dimension.SYM_DONTCARE:
        return Dimension.DONTCARE
      case Dimension.SYM_P:
        return Dimension.P
      case Dimension.SYM_L:
        return Dimension.L
      case Dimension.SYM_A:
        return Dimension.A
    }
    throw new IllegalArgumentException('Unknown dimension symbol: ' + dimensionSymbol)
  }
  getClass () {
    return Dimension
  }
  get interfaces_ () {
    return []
  }
}
Dimension.constructor_ = function () {}
Dimension.P = 0
Dimension.L = 1
Dimension.A = 2
Dimension.FALSE = -1
Dimension.TRUE = -2
Dimension.DONTCARE = -3
Dimension.SYM_FALSE = 'F'
Dimension.SYM_TRUE = 'T'
Dimension.SYM_DONTCARE = '*'
Dimension.SYM_P = '0'
Dimension.SYM_L = '1'
Dimension.SYM_A = '2'
