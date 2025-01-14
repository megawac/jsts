import StringBuffer from '../../../../java/lang/StringBuffer'
import hasInterface from '../../../../hasInterface'
import NodedSegmentString from './NodedSegmentString'
import ArrayList from '../../../../java/util/ArrayList'
import LinearComponentExtracter from '../geom/util/LinearComponentExtracter'
import List from '../../../../java/util/List'
export default class SegmentStringUtil {
  constructor () {
    SegmentStringUtil.constructor_.apply(this, arguments)
  }
  static toGeometry (segStrings, geomFact) {
    var lines = new Array(segStrings.size()).fill(null)
    var index = 0
    for (var i = segStrings.iterator(); i.hasNext();) {
      var ss = i.next()
      var line = geomFact.createLineString(ss.getCoordinates())
      lines[index++] = line
    }
    if (lines.length === 1) return lines[0]
    return geomFact.createMultiLineString(lines)
  }
  static extractNodedSegmentStrings (geom) {
    var segStr = new ArrayList()
    var lines = LinearComponentExtracter.getLines(geom)
    for (var i = lines.iterator(); i.hasNext();) {
      var line = i.next()
      var pts = line.getCoordinates()
      segStr.add(new NodedSegmentString(pts, geom))
    }
    return segStr
  }
  static extractSegmentStrings (geom) {
    return SegmentStringUtil.extractNodedSegmentStrings(geom)
  }
  static toString () {
    if (arguments.length === 1 && hasInterface(arguments[0], List)) {
      let segStrings = arguments[0]
      var buf = new StringBuffer()
      for (var i = segStrings.iterator(); i.hasNext();) {
        var segStr = i.next()
        buf.append(segStr.toString())
        buf.append('\n')
      }
      return buf.toString()
    }
  }
  getClass () {
    return SegmentStringUtil
  }
  get interfaces_ () {
    return []
  }
}
SegmentStringUtil.constructor_ = function () {}
