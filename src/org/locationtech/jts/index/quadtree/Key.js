import Coordinate from '../../geom/Coordinate'
import DoubleBits from './DoubleBits'
import Envelope from '../../geom/Envelope'
export default class Key {
  constructor () {
    Key.constructor_.apply(this, arguments)
  }
  static computeQuadLevel (env) {
    var dx = env.getWidth()
    var dy = env.getHeight()
    var dMax = dx > dy ? dx : dy
    var level = DoubleBits.exponent(dMax) + 1
    return level
  }
  getLevel () {
    return this._level
  }
  computeKey () {
    if (arguments.length === 1) {
      let itemEnv = arguments[0]
      this._level = Key.computeQuadLevel(itemEnv)
      this._env = new Envelope()
      this.computeKey(this._level, itemEnv)
      while (!this._env.contains(itemEnv)) {
        this._level += 1
        this.computeKey(this._level, itemEnv)
      }
    } else if (arguments.length === 2) {
      let level = arguments[0]; let itemEnv = arguments[1]
      var quadSize = DoubleBits.powerOf2(level)
      this._pt.x = Math.floor(itemEnv.getMinX() / quadSize) * quadSize
      this._pt.y = Math.floor(itemEnv.getMinY() / quadSize) * quadSize
      this._env.init(this._pt.x, this._pt.x + quadSize, this._pt.y, this._pt.y + quadSize)
    }
  }
  getEnvelope () {
    return this._env
  }
  getCentre () {
    return new Coordinate((this._env.getMinX() + this._env.getMaxX()) / 2, (this._env.getMinY() + this._env.getMaxY()) / 2)
  }
  getPoint () {
    return this._pt
  }
  getClass () {
    return Key
  }
  get interfaces_ () {
    return []
  }
}
Key.constructor_ = function () {
  this._pt = new Coordinate()
  this._level = 0
  this._env = null
  let itemEnv = arguments[0]
  this.computeKey(itemEnv)
}
