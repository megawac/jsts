import LineString from '../LineString'
import GeometryFactory from '../GeometryFactory'
import IllegalArgumentException from '../../../../../java/lang/IllegalArgumentException'
import Point from '../Point'
import Polygon from '../Polygon'
import MultiPoint from '../MultiPoint'
import LinearRing from '../LinearRing'
import MultiPolygon from '../MultiPolygon'
import GeometryCollection from '../GeometryCollection'
import ArrayList from '../../../../../java/util/ArrayList'
import MultiLineString from '../MultiLineString'
export default class GeometryTransformer {
  constructor () {
    GeometryTransformer.constructor_.apply(this, arguments)
  }
  transformPoint (geom, parent) {
    return this._factory.createPoint(this.transformCoordinates(geom.getCoordinateSequence(), geom))
  }
  transformPolygon (geom, parent) {
    var isAllValidLinearRings = true
    var shell = this.transformLinearRing(geom.getExteriorRing(), geom)
    if (shell === null || !(shell instanceof LinearRing) || shell.isEmpty()) isAllValidLinearRings = false
    var holes = new ArrayList()
    for (var i = 0; i < geom.getNumInteriorRing(); i++) {
      var hole = this.transformLinearRing(geom.getInteriorRingN(i), geom)
      if (hole === null || hole.isEmpty()) {
        continue
      }
      if (!(hole instanceof LinearRing)) isAllValidLinearRings = false
      holes.add(hole)
    }
    if (isAllValidLinearRings) return this._factory.createPolygon(shell, holes.toArray([])); else {
      var components = new ArrayList()
      if (shell !== null) components.add(shell)
      components.addAll(holes)
      return this._factory.buildGeometry(components)
    }
  }
  createCoordinateSequence (coords) {
    return this._factory.getCoordinateSequenceFactory().create(coords)
  }
  getInputGeometry () {
    return this._inputGeom
  }
  transformMultiLineString (geom, parent) {
    var transGeomList = new ArrayList()
    for (var i = 0; i < geom.getNumGeometries(); i++) {
      var transformGeom = this.transformLineString(geom.getGeometryN(i), geom)
      if (transformGeom === null) continue
      if (transformGeom.isEmpty()) continue
      transGeomList.add(transformGeom)
    }
    return this._factory.buildGeometry(transGeomList)
  }
  transformCoordinates (coords, parent) {
    return this.copy(coords)
  }
  transformLineString (geom, parent) {
    return this._factory.createLineString(this.transformCoordinates(geom.getCoordinateSequence(), geom))
  }
  transformMultiPoint (geom, parent) {
    var transGeomList = new ArrayList()
    for (var i = 0; i < geom.getNumGeometries(); i++) {
      var transformGeom = this.transformPoint(geom.getGeometryN(i), geom)
      if (transformGeom === null) continue
      if (transformGeom.isEmpty()) continue
      transGeomList.add(transformGeom)
    }
    return this._factory.buildGeometry(transGeomList)
  }
  transformMultiPolygon (geom, parent) {
    var transGeomList = new ArrayList()
    for (var i = 0; i < geom.getNumGeometries(); i++) {
      var transformGeom = this.transformPolygon(geom.getGeometryN(i), geom)
      if (transformGeom === null) continue
      if (transformGeom.isEmpty()) continue
      transGeomList.add(transformGeom)
    }
    return this._factory.buildGeometry(transGeomList)
  }
  copy (seq) {
    return seq.copy()
  }
  transformGeometryCollection (geom, parent) {
    var transGeomList = new ArrayList()
    for (var i = 0; i < geom.getNumGeometries(); i++) {
      var transformGeom = this.transform(geom.getGeometryN(i))
      if (transformGeom === null) continue
      if (this._pruneEmptyGeometry && transformGeom.isEmpty()) continue
      transGeomList.add(transformGeom)
    }
    if (this._preserveGeometryCollectionType) return this._factory.createGeometryCollection(GeometryFactory.toGeometryArray(transGeomList))
    return this._factory.buildGeometry(transGeomList)
  }
  transform (inputGeom) {
    this._inputGeom = inputGeom
    this._factory = inputGeom.getFactory()
    if (inputGeom instanceof Point) return this.transformPoint(inputGeom, null)
    if (inputGeom instanceof MultiPoint) return this.transformMultiPoint(inputGeom, null)
    if (inputGeom instanceof LinearRing) return this.transformLinearRing(inputGeom, null)
    if (inputGeom instanceof LineString) return this.transformLineString(inputGeom, null)
    if (inputGeom instanceof MultiLineString) return this.transformMultiLineString(inputGeom, null)
    if (inputGeom instanceof Polygon) return this.transformPolygon(inputGeom, null)
    if (inputGeom instanceof MultiPolygon) return this.transformMultiPolygon(inputGeom, null)
    if (inputGeom instanceof GeometryCollection) return this.transformGeometryCollection(inputGeom, null)
    throw new IllegalArgumentException('Unknown Geometry subtype: ' + inputGeom.getClass().getName())
  }
  transformLinearRing (geom, parent) {
    var seq = this.transformCoordinates(geom.getCoordinateSequence(), geom)
    if (seq === null) return this._factory.createLinearRing(null)
    var seqSize = seq.size()
    if (seqSize > 0 && seqSize < 4 && !this._preserveType) return this._factory.createLineString(seq)
    return this._factory.createLinearRing(seq)
  }
  getClass () {
    return GeometryTransformer
  }
  get interfaces_ () {
    return []
  }
}
GeometryTransformer.constructor_ = function () {
  this._inputGeom = null
  this._factory = null
  this._pruneEmptyGeometry = true
  this._preserveGeometryCollectionType = true
  this._preserveCollections = false
  this._preserveType = false
}
