import ArrayList from '../../../../../java/util/ArrayList'
import Assert from '../../util/Assert'
import OverlayOp from './OverlayOp'
export default class LineBuilder {
  constructor () {
    LineBuilder.constructor_.apply(this, arguments)
  }
  collectLines (opCode) {
    for (var it = this._op.getGraph().getEdgeEnds().iterator(); it.hasNext();) {
      var de = it.next()
      this.collectLineEdge(de, opCode, this._lineEdgesList)
      this.collectBoundaryTouchEdge(de, opCode, this._lineEdgesList)
    }
  }
  labelIsolatedLine (e, targetIndex) {
    var loc = this._ptLocator.locate(e.getCoordinate(), this._op.getArgGeometry(targetIndex))
    e.getLabel().setLocation(targetIndex, loc)
  }
  build (opCode) {
    this.findCoveredLineEdges()
    this.collectLines(opCode)
    this.buildLines(opCode)
    return this._resultLineList
  }
  collectLineEdge (de, opCode, edges) {
    var label = de.getLabel()
    var e = de.getEdge()
    if (de.isLineEdge()) {
      if (!de.isVisited() && OverlayOp.isResultOfOp(label, opCode) && !e.isCovered()) {
        edges.add(e)
        de.setVisitedEdge(true)
      }
    }
  }
  findCoveredLineEdges () {
    for (var nodeit = this._op.getGraph().getNodes().iterator(); nodeit.hasNext();) {
      var node = nodeit.next()
      node.getEdges().findCoveredLineEdges()
    }
    for (var it = this._op.getGraph().getEdgeEnds().iterator(); it.hasNext();) {
      var de = it.next()
      var e = de.getEdge()
      if (de.isLineEdge() && !e.isCoveredSet()) {
        var isCovered = this._op.isCoveredByA(de.getCoordinate())
        e.setCovered(isCovered)
      }
    }
  }
  labelIsolatedLines (edgesList) {
    for (var it = edgesList.iterator(); it.hasNext();) {
      var e = it.next()
      var label = e.getLabel()
      if (e.isIsolated()) {
        if (label.isNull(0)) this.labelIsolatedLine(e, 0); else this.labelIsolatedLine(e, 1)
      }
    }
  }
  buildLines (opCode) {
    for (var it = this._lineEdgesList.iterator(); it.hasNext();) {
      var e = it.next()
      var label = e.getLabel()
      var line = this._geometryFactory.createLineString(e.getCoordinates())
      this._resultLineList.add(line)
      e.setInResult(true)
    }
  }
  collectBoundaryTouchEdge (de, opCode, edges) {
    var label = de.getLabel()
    if (de.isLineEdge()) return null
    if (de.isVisited()) return null
    if (de.isInteriorAreaEdge()) return null
    if (de.getEdge().isInResult()) return null
    Assert.isTrue(!(de.isInResult() || de.getSym().isInResult()) || !de.getEdge().isInResult())
    if (OverlayOp.isResultOfOp(label, opCode) && opCode === OverlayOp.INTERSECTION) {
      edges.add(de.getEdge())
      de.setVisitedEdge(true)
    }
  }
  getClass () {
    return LineBuilder
  }
  get interfaces_ () {
    return []
  }
}
LineBuilder.constructor_ = function () {
  this._op = null
  this._geometryFactory = null
  this._ptLocator = null
  this._lineEdgesList = new ArrayList()
  this._resultLineList = new ArrayList()
  let op = arguments[0]; let geometryFactory = arguments[1]; let ptLocator = arguments[2]
  this._op = op
  this._geometryFactory = geometryFactory
  this._ptLocator = ptLocator
}
