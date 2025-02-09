import Integer from '../../../../../java/lang/Integer'
import ArrayList from '../../../../../java/util/ArrayList'
import Quadrant from '../Quadrant'
export default class MonotoneChainIndexer {
  constructor () {
    MonotoneChainIndexer.constructor_.apply(this, arguments)
  }
  static toIntArray (list) {
    var array = new Array(list.size()).fill(null)
    for (var i = 0; i < array.length; i++) {
      array[i] = list.get(i).intValue()
    }
    return array
  }
  getChainStartIndices (pts) {
    var start = 0
    var startIndexList = new ArrayList()
    startIndexList.add(new Integer(start))
    do {
      var last = this.findChainEnd(pts, start)
      startIndexList.add(new Integer(last))
      start = last
    } while (start < pts.length - 1)
    var startIndex = MonotoneChainIndexer.toIntArray(startIndexList)
    return startIndex
  }
  findChainEnd (pts, start) {
    var chainQuad = Quadrant.quadrant(pts[start], pts[start + 1])
    var last = start + 1
    while (last < pts.length) {
      var quad = Quadrant.quadrant(pts[last - 1], pts[last])
      if (quad !== chainQuad) break
      last++
    }
    return last - 1
  }
  getClass () {
    return MonotoneChainIndexer
  }
  get interfaces_ () {
    return []
  }
}
MonotoneChainIndexer.constructor_ = function () {}
