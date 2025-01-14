import StringBuffer from '../../../../java/lang/StringBuffer'
import Location from '../geom/Location'
import Position from './Position'
export default class TopologyLocation {
  constructor () {
    TopologyLocation.constructor_.apply(this, arguments)
  }
  setAllLocations (locValue) {
    for (var i = 0; i < this.location.length; i++) {
      this.location[i] = locValue
    }
  }
  isNull () {
    for (var i = 0; i < this.location.length; i++) {
      if (this.location[i] !== Location.NONE) return false
    }
    return true
  }
  setAllLocationsIfNull (locValue) {
    for (var i = 0; i < this.location.length; i++) {
      if (this.location[i] === Location.NONE) this.location[i] = locValue
    }
  }
  isLine () {
    return this.location.length === 1
  }
  merge (gl) {
    if (gl.location.length > this.location.length) {
      var newLoc = new Array(3).fill(null)
      newLoc[Position.ON] = this.location[Position.ON]
      newLoc[Position.LEFT] = Location.NONE
      newLoc[Position.RIGHT] = Location.NONE
      this.location = newLoc
    }
    for (var i = 0; i < this.location.length; i++) {
      if (this.location[i] === Location.NONE && i < gl.location.length) this.location[i] = gl.location[i]
    }
  }
  getLocations () {
    return this.location
  }
  flip () {
    if (this.location.length <= 1) return null
    var temp = this.location[Position.LEFT]
    this.location[Position.LEFT] = this.location[Position.RIGHT]
    this.location[Position.RIGHT] = temp
  }
  toString () {
    var buf = new StringBuffer()
    if (this.location.length > 1) buf.append(Location.toLocationSymbol(this.location[Position.LEFT]))
    buf.append(Location.toLocationSymbol(this.location[Position.ON]))
    if (this.location.length > 1) buf.append(Location.toLocationSymbol(this.location[Position.RIGHT]))
    return buf.toString()
  }
  setLocations (on, left, right) {
    this.location[Position.ON] = on
    this.location[Position.LEFT] = left
    this.location[Position.RIGHT] = right
  }
  get (posIndex) {
    if (posIndex < this.location.length) return this.location[posIndex]
    return Location.NONE
  }
  isArea () {
    return this.location.length > 1
  }
  isAnyNull () {
    for (var i = 0; i < this.location.length; i++) {
      if (this.location[i] === Location.NONE) return true
    }
    return false
  }
  setLocation () {
    if (arguments.length === 1) {
      let locValue = arguments[0]
      this.setLocation(Position.ON, locValue)
    } else if (arguments.length === 2) {
      let locIndex = arguments[0]; let locValue = arguments[1]
      this.location[locIndex] = locValue
    }
  }
  init (size) {
    this.location = new Array(size).fill(null)
    this.setAllLocations(Location.NONE)
  }
  isEqualOnSide (le, locIndex) {
    return this.location[locIndex] === le.location[locIndex]
  }
  allPositionsEqual (loc) {
    for (var i = 0; i < this.location.length; i++) {
      if (this.location[i] !== loc) return false
    }
    return true
  }
  getClass () {
    return TopologyLocation
  }
  get interfaces_ () {
    return []
  }
}
TopologyLocation.constructor_ = function () {
  this.location = null
  if (arguments.length === 1) {
    if (arguments[0] instanceof Array) {
      let location = arguments[0]
      this.init(location.length)
    } else if (Number.isInteger(arguments[0])) {
      let on = arguments[0]
      this.init(1)
      this.location[Position.ON] = on
    } else if (arguments[0] instanceof TopologyLocation) {
      let gl = arguments[0]
      this.init(gl.location.length)
      if (gl !== null) {
        for (var i = 0; i < this.location.length; i++) {
          this.location[i] = gl.location[i]
        }
      }
    }
  } else if (arguments.length === 3) {
    let on = arguments[0]; let left = arguments[1]; let right = arguments[2]
    this.init(3)
    this.location[Position.ON] = on
    this.location[Position.LEFT] = left
    this.location[Position.RIGHT] = right
  }
}
