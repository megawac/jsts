import Assert from '../../util/Assert'
export default class Interval {
  constructor () {
    Interval.constructor_.apply(this, arguments)
  }
  expandToInclude (other) {
    this._max = Math.max(this._max, other._max)
    this._min = Math.min(this._min, other._min)
    return this
  }
  getCentre () {
    return (this._min + this._max) / 2
  }
  intersects (other) {
    return !(other._min > this._max || other._max < this._min)
  }
  equals (o) {
    if (!(o instanceof Interval)) {
      return false
    }
    var other = o
    return this._min === other._min && this._max === other._max
  }
  getClass () {
    return Interval
  }
  get interfaces_ () {
    return []
  }
}
Interval.constructor_ = function () {
  this._min = null
  this._max = null
  if (arguments.length === 1) {
    let other = arguments[0]
    Interval.constructor_.call(this, other._min, other._max)
  } else if (arguments.length === 2) {
    let min = arguments[0]; let max = arguments[1]
    Assert.isTrue(min <= max)
    this._min = min
    this._max = max
  }
}
