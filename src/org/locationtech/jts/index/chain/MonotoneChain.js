import Envelope from '../../geom/Envelope'
export default class MonotoneChain {
  constructor () {
    MonotoneChain.constructor_.apply(this, arguments)
  }
  getLineSegment (index, ls) {
    ls.p0 = this._pts[index]
    ls.p1 = this._pts[index + 1]
  }
  computeSelect (searchEnv, start0, end0, mcs) {
    var p0 = this._pts[start0]
    var p1 = this._pts[end0]
    if (end0 - start0 === 1) {
      mcs.select(this, start0)
      return null
    }
    if (!searchEnv.intersects(p0, p1)) return null
    var mid = Math.trunc((start0 + end0) / 2)
    if (start0 < mid) {
      this.computeSelect(searchEnv, start0, mid, mcs)
    }
    if (mid < end0) {
      this.computeSelect(searchEnv, mid, end0, mcs)
    }
  }
  getCoordinates () {
    var coord = new Array(this._end - this._start + 1).fill(null)
    var index = 0
    for (var i = this._start; i <= this._end; i++) {
      coord[index++] = this._pts[i]
    }
    return coord
  }
  computeOverlaps () {
    if (arguments.length === 2) {
      let mc = arguments[0]; let mco = arguments[1]
      this.computeOverlaps(this._start, this._end, mc, mc._start, mc._end, mco)
    } else if (arguments.length === 6) {
      let start0 = arguments[0]; let end0 = arguments[1]; let mc = arguments[2]; let start1 = arguments[3]; let end1 = arguments[4]; let mco = arguments[5]
      if (end0 - start0 === 1 && end1 - start1 === 1) {
        mco.overlap(this, start0, mc, start1)
        return null
      }
      if (!this.overlaps(start0, end0, mc, start1, end1)) return null
      var mid0 = Math.trunc((start0 + end0) / 2)
      var mid1 = Math.trunc((start1 + end1) / 2)
      if (start0 < mid0) {
        if (start1 < mid1) this.computeOverlaps(start0, mid0, mc, start1, mid1, mco)
        if (mid1 < end1) this.computeOverlaps(start0, mid0, mc, mid1, end1, mco)
      }
      if (mid0 < end0) {
        if (start1 < mid1) this.computeOverlaps(mid0, end0, mc, start1, mid1, mco)
        if (mid1 < end1) this.computeOverlaps(mid0, end0, mc, mid1, end1, mco)
      }
    }
  }
  setId (id) {
    this._id = id
  }
  select (searchEnv, mcs) {
    this.computeSelect(searchEnv, this._start, this._end, mcs)
  }
  getEnvelope () {
    if (this._env === null) {
      var p0 = this._pts[this._start]
      var p1 = this._pts[this._end]
      this._env = new Envelope(p0, p1)
    }
    return this._env
  }
  overlaps (start0, end0, mc, start1, end1) {
    return Envelope.intersects(this._pts[start0], this._pts[end0], mc._pts[start1], mc._pts[end1])
  }
  getEndIndex () {
    return this._end
  }
  getStartIndex () {
    return this._start
  }
  getContext () {
    return this._context
  }
  getId () {
    return this._id
  }
  getClass () {
    return MonotoneChain
  }
  get interfaces_ () {
    return []
  }
}
MonotoneChain.constructor_ = function () {
  this._pts = null
  this._start = null
  this._end = null
  this._env = null
  this._context = null
  this._id = null
  let pts = arguments[0]; let start = arguments[1]; let end = arguments[2]; let context = arguments[3]
  this._pts = pts
  this._start = start
  this._end = end
  this._context = context
}
