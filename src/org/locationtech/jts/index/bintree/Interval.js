export default class Interval {
  constructor () {
    Interval.constructor_.apply(this, arguments)
  }
  expandToInclude (interval) {
    if (interval.max > this.max) this.max = interval.max
    if (interval.min < this.min) this.min = interval.min
  }
  getWidth () {
    return this.max - this.min
  }
  overlaps () {
    if (arguments.length === 1) {
      let interval = arguments[0]
      return this.overlaps(interval.min, interval.max)
    } else if (arguments.length === 2) {
      let min = arguments[0]; let max = arguments[1]
      if (this.min > max || this.max < min) return false
      return true
    }
  }
  getMin () {
    return this.min
  }
  toString () {
    return '[' + this.min + ', ' + this.max + ']'
  }
  contains () {
    if (arguments.length === 1) {
      if (arguments[0] instanceof Interval) {
        let interval = arguments[0]
        return this.contains(interval.min, interval.max)
      } else if (typeof arguments[0] === 'number') {
        let p = arguments[0]
        return p >= this.min && p <= this.max
      }
    } else if (arguments.length === 2) {
      let min = arguments[0]; let max = arguments[1]
      return min >= this.min && max <= this.max
    }
  }
  init (min, max) {
    this.min = min
    this.max = max
    if (min > max) {
      this.min = max
      this.max = min
    }
  }
  getMax () {
    return this.max
  }
  getClass () {
    return Interval
  }
  get interfaces_ () {
    return []
  }
}
Interval.constructor_ = function () {
  this.min = null
  this.max = null
  if (arguments.length === 0) {
    this.min = 0.0
    this.max = 0.0
  } else if (arguments.length === 1) {
    let interval = arguments[0]
    this.init(interval.min, interval.max)
  } else if (arguments.length === 2) {
    let min = arguments[0]; let max = arguments[1]
    this.init(min, max)
  }
}
