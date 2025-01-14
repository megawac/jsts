import StringBuffer from '../../../../java/lang/StringBuffer'
import Location from '../geom/Location'
import Position from './Position'
import TopologyLocation from './TopologyLocation'
export default class Label {
  constructor () {
    Label.constructor_.apply(this, arguments)
  }
  static toLineLabel (label) {
    var lineLabel = new Label(Location.NONE)
    for (var i = 0; i < 2; i++) {
      lineLabel.setLocation(i, label.getLocation(i))
    }
    return lineLabel
  }
  getGeometryCount () {
    var count = 0
    if (!this.elt[0].isNull()) count++
    if (!this.elt[1].isNull()) count++
    return count
  }
  setAllLocations (geomIndex, location) {
    this.elt[geomIndex].setAllLocations(location)
  }
  isNull (geomIndex) {
    return this.elt[geomIndex].isNull()
  }
  setAllLocationsIfNull () {
    if (arguments.length === 1) {
      let location = arguments[0]
      this.setAllLocationsIfNull(0, location)
      this.setAllLocationsIfNull(1, location)
    } else if (arguments.length === 2) {
      let geomIndex = arguments[0]; let location = arguments[1]
      this.elt[geomIndex].setAllLocationsIfNull(location)
    }
  }
  isLine (geomIndex) {
    return this.elt[geomIndex].isLine()
  }
  merge (lbl) {
    for (var i = 0; i < 2; i++) {
      if (this.elt[i] === null && lbl.elt[i] !== null) {
        this.elt[i] = new TopologyLocation(lbl.elt[i])
      } else {
        this.elt[i].merge(lbl.elt[i])
      }
    }
  }
  flip () {
    this.elt[0].flip()
    this.elt[1].flip()
  }
  getLocation () {
    if (arguments.length === 1) {
      let geomIndex = arguments[0]
      return this.elt[geomIndex].get(Position.ON)
    } else if (arguments.length === 2) {
      let geomIndex = arguments[0]; let posIndex = arguments[1]
      return this.elt[geomIndex].get(posIndex)
    }
  }
  toString () {
    var buf = new StringBuffer()
    if (this.elt[0] !== null) {
      buf.append('A:')
      buf.append(this.elt[0].toString())
    }
    if (this.elt[1] !== null) {
      buf.append(' B:')
      buf.append(this.elt[1].toString())
    }
    return buf.toString()
  }
  isArea () {
    if (arguments.length === 0) {
      return this.elt[0].isArea() || this.elt[1].isArea()
    } else if (arguments.length === 1) {
      let geomIndex = arguments[0]
      return this.elt[geomIndex].isArea()
    }
  }
  isAnyNull (geomIndex) {
    return this.elt[geomIndex].isAnyNull()
  }
  setLocation () {
    if (arguments.length === 2) {
      let geomIndex = arguments[0]; let location = arguments[1]
      this.elt[geomIndex].setLocation(Position.ON, location)
    } else if (arguments.length === 3) {
      let geomIndex = arguments[0]; let posIndex = arguments[1]; let location = arguments[2]
      this.elt[geomIndex].setLocation(posIndex, location)
    }
  }
  isEqualOnSide (lbl, side) {
    return this.elt[0].isEqualOnSide(lbl.elt[0], side) && this.elt[1].isEqualOnSide(lbl.elt[1], side)
  }
  allPositionsEqual (geomIndex, loc) {
    return this.elt[geomIndex].allPositionsEqual(loc)
  }
  toLine (geomIndex) {
    if (this.elt[geomIndex].isArea()) this.elt[geomIndex] = new TopologyLocation(this.elt[geomIndex].location[0])
  }
  getClass () {
    return Label
  }
  get interfaces_ () {
    return []
  }
}
Label.constructor_ = function () {
  this.elt = new Array(2).fill(null)
  if (arguments.length === 1) {
    if (Number.isInteger(arguments[0])) {
      let onLoc = arguments[0]
      this.elt[0] = new TopologyLocation(onLoc)
      this.elt[1] = new TopologyLocation(onLoc)
    } else if (arguments[0] instanceof Label) {
      let lbl = arguments[0]
      this.elt[0] = new TopologyLocation(lbl.elt[0])
      this.elt[1] = new TopologyLocation(lbl.elt[1])
    }
  } else if (arguments.length === 2) {
    let geomIndex = arguments[0]; let onLoc = arguments[1]
    this.elt[0] = new TopologyLocation(Location.NONE)
    this.elt[1] = new TopologyLocation(Location.NONE)
    this.elt[geomIndex].setLocation(onLoc)
  } else if (arguments.length === 3) {
    let onLoc = arguments[0]; let leftLoc = arguments[1]; let rightLoc = arguments[2]
    this.elt[0] = new TopologyLocation(onLoc, leftLoc, rightLoc)
    this.elt[1] = new TopologyLocation(onLoc, leftLoc, rightLoc)
  } else if (arguments.length === 4) {
    let geomIndex = arguments[0]; let onLoc = arguments[1]; let leftLoc = arguments[2]; let rightLoc = arguments[3]
    this.elt[0] = new TopologyLocation(Location.NONE, Location.NONE, Location.NONE)
    this.elt[1] = new TopologyLocation(Location.NONE, Location.NONE, Location.NONE)
    this.elt[geomIndex].setLocations(onLoc, leftLoc, rightLoc)
  }
}
