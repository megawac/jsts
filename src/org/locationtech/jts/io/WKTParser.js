import Coordinate from '../geom/Coordinate'
import GeometryFactory from '../geom/GeometryFactory'

const regExes = {
  'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
  'emptyTypeStr': /^\s*(\w+)\s*EMPTY\s*$/,
  'spaces': /\s+/,
  'parenComma': /\)\s*,\s*\(/,
  'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/, // can't use {2} here
  'trimParens': /^\s*\(?(.*?)\)?\s*$/
}

/**
 * Class for reading and writing Well-Known Text.
 *
 * NOTE: Adapted from OpenLayers 2.11 implementation.
 */

export default class WKTParser {
  /** Create a new parser for WKT
   *
   * @param {GeometryFactory} geometryFactory
   * @return An instance of WKTParser.
   * @private
   */
  constructor (geometryFactory) {
    this.geometryFactory = geometryFactory || new GeometryFactory()
    this.precisionModel = this.geometryFactory.getPrecisionModel()
  }

  /**
   * Deserialize a WKT string and return a geometry. Supports WKT for POINT,
   * MULTIPOINT, LINESTRING, LINEARRING, MULTILINESTRING, POLYGON, MULTIPOLYGON,
   * and GEOMETRYCOLLECTION.
   *
   * @param {String} wkt A WKT string.
   * @return {Geometry} A geometry instance.
   * @private
   */
  read (wkt) {
    var geometry, type, str
    wkt = wkt.replace(/[\n\r]/g, ' ')
    var matches = regExes.typeStr.exec(wkt)
    if (wkt.search('EMPTY') !== -1) {
      matches = regExes.emptyTypeStr.exec(wkt)
      matches[2] = undefined
    }
    if (matches) {
      type = matches[1].toLowerCase()
      str = matches[2]
      if (parse[type]) {
        geometry = parse[type].call(this, str)
      }
    }

    if (geometry === undefined) throw new Error('Could not parse WKT ' + wkt)

    return geometry
  }

  /**
   * Serialize a geometry into a WKT string.
   *
   * @param {Geometry} geometry A feature or array of features.
   * @return {String} The WKT string representation of the input geometries.
   * @private
   */
  write (geometry) {
    return this.extractGeometry(geometry)
  }

  /**
   * Entry point to construct the WKT for a single Geometry object.
   *
   * @param {Geometry} geometry
   * @return {String} A WKT string of representing the geometry.
   * @private
   */
  extractGeometry (geometry) {
    var type = geometry.getGeometryType().toLowerCase()
    if (!extract[type]) {
      return null
    }
    var wktType = type.toUpperCase()
    var data
    if (geometry.isEmpty()) {
      data = wktType + ' EMPTY'
    } else {
      data = wktType + '(' + extract[type].call(this, geometry) + ')'
    }
    return data
  }
}

/**
 * Object with properties corresponding to the geometry types. Property values
 * are functions that do the actual data extraction.
 * @private
 */
const extract = {
  coordinate (coordinate) {
    this.precisionModel.makePrecise(coordinate)
    return coordinate.x + ' ' + coordinate.y
  },

  /**
   * Return a space delimited string of point coordinates.
   *
   * @param {Point}
   *          point
   * @return {String} A string of coordinates representing the point.
   */
  point (point) {
    return extract.coordinate.call(this, point._coordinates._coordinates[0])
  },

  /**
   * Return a comma delimited string of point coordinates from a multipoint.
   *
   * @param {MultiPoint}
   *          multipoint
   * @return {String} A string of point coordinate strings representing the
   *         multipoint.
   */
  multipoint (multipoint) {
    var array = []
    for (let i = 0, len = multipoint._geometries.length; i < len; ++i) {
      array.push('(' + extract.point.call(this, multipoint._geometries[i]) + ')')
    }
    return array.join(',')
  },

  /**
   * Return a comma delimited string of point coordinates from a line.
   *
   * @param {LineString} linestring
   * @return {String} A string of point coordinate strings representing the linestring.
   */
  linestring (linestring) {
    var array = []
    for (let i = 0, len = linestring._points._coordinates.length; i < len; ++i) {
      array.push(extract.coordinate.call(this, linestring._points._coordinates[i]))
    }
    return array.join(',')
  },

  linearring (linearring) {
    var array = []
    for (let i = 0, len = linearring._points._coordinates.length; i < len; ++i) {
      array.push(extract.coordinate.call(this, linearring._points._coordinates[i]))
    }
    return array.join(',')
  },

  /**
   * Return a comma delimited string of linestring strings from a
   * multilinestring.
   *
   * @param {MultiLineString} multilinestring
   * @return {String} A string of of linestring strings representing the multilinestring.
   */
  multilinestring (multilinestring) {
    var array = []
    for (let i = 0, len = multilinestring._geometries.length; i < len; ++i) {
      array.push('(' +
        extract.linestring.call(this, multilinestring._geometries[i]) +
        ')')
    }
    return array.join(',')
  },

  /**
   * Return a comma delimited string of linear ring arrays from a polygon.
   *
   * @param {Polygon} polygon
   * @return {String} An array of linear ring arrays representing the polygon.
   */
  polygon (polygon) {
    var array = []
    array.push('(' + extract.linestring.call(this, polygon._shell) + ')')
    for (let i = 0, len = polygon._holes.length; i < len; ++i) {
      array.push('(' + extract.linestring.call(this, polygon._holes[i]) + ')')
    }
    return array.join(',')
  },

  /**
   * Return an array of polygon arrays from a multipolygon.
   *
   * @param {MultiPolygon} multipolygon
   * @return {String} An array of polygon arrays representing the multipolygon.
   */
  multipolygon (multipolygon) {
    var array = []
    for (let i = 0, len = multipolygon._geometries.length; i < len; ++i) {
      array.push('(' + extract.polygon.call(this, multipolygon._geometries[i]) + ')')
    }
    return array.join(',')
  },

  /**
   * Return the WKT portion between 'GEOMETRYCOLLECTION(' and ')' for an
   * geometrycollection.
   *
   * @param {GeometryCollection} collection
   * @return {String} internal WKT representation of the collection.
   */
  geometrycollection (collection) {
    var array = []
    for (let i = 0, len = collection._geometries.length; i < len; ++i) {
      array.push(this.extractGeometry(collection._geometries[i]))
    }
    return array.join(',')
  }
}

/**
 * Object with properties corresponding to the geometry types. Property values
 * are functions that do the actual parsing.
 * @private
 */
const parse = {

  coord (str) {
    var coords = str.trim().split(regExes.spaces)
    var coord = new Coordinate(Number.parseFloat(coords[0]), Number.parseFloat(coords[1]))
    this.precisionModel.makePrecise(coord)
    return coord
  },

  /**
   * Return point geometry given a point WKT fragment.
   *
   * @param {String} str A WKT fragment representing the point.
   * @return {Point} A point geometry.
   * @private
   */
  point (str) {
    if (str === undefined) { return this.geometryFactory.createPoint() }
    return this.geometryFactory.createPoint(parse.coord.call(this, str))
  },

  /**
   * Return a multipoint geometry given a multipoint WKT fragment.
   *
   * @param {String} str A WKT fragment representing the multipoint.
   * @return {Point} A multipoint feature.
   * @private
   */
  multipoint (str) {
    if (str === undefined) { return this.geometryFactory.createMultiPoint() }
    var point
    var points = str.trim().split(',')
    var components = []
    for (let i = 0, len = points.length; i < len; ++i) {
      point = points[i].replace(regExes.trimParens, '$1')
      components.push(parse.point.call(this, point))
    }
    return this.geometryFactory.createMultiPoint(components)
  },

  /**
   * Return a linestring geometry given a linestring WKT fragment.
   *
   * @param {String} str A WKT fragment representing the linestring.
   * @return {LineString} A linestring geometry.
   * @private
   */
  linestring (str) {
    if (str === undefined) {
      return this.geometryFactory.createLineString()
    }

    var points = str.trim().split(',')
    var components = []
    var coords
    for (let i = 0, len = points.length; i < len; ++i) {
      components.push(parse.coord.call(this, points[i]))
    }
    return this.geometryFactory.createLineString(components)
  },

  /**
   * Return a linearring geometry given a linearring WKT fragment.
   *
   * @param {String} str A WKT fragment representing the linearring.
   * @return {LinearRing} A linearring geometry.
   * @private
   */
  linearring (str) {
    if (str === undefined) {
      return this.geometryFactory.createLinearRing()
    }

    var points = str.trim().split(',')
    var components = []
    var coords
    for (let i = 0, len = points.length; i < len; ++i) {
      components.push(parse.coord.call(this, points[i]))
    }
    return this.geometryFactory.createLinearRing(components)
  },

  /**
   * Return a multilinestring geometry given a multilinestring WKT fragment.
   *
   * @param {String} str A WKT fragment representing the multilinestring.
   * @return {MultiLineString} A multilinestring geometry.
   * @private
   */
  multilinestring (str) {
    if (str === undefined) {
      return this.geometryFactory.createMultiLineString()
    }

    var line
    var lines = str.trim().split(regExes.parenComma)
    var components = []
    for (let i = 0, len = lines.length; i < len; ++i) {
      line = lines[i].replace(regExes.trimParens, '$1')
      components.push(parse.linestring.call(this, line))
    }
    return this.geometryFactory.createMultiLineString(components)
  },

  /**
   * Return a polygon geometry given a polygon WKT fragment.
   *
   * @param {String} str A WKT fragment representing the polygon.
   * @return {Polygon} A polygon geometry.
   * @private
   */
  polygon (str) {
    if (str === undefined) {
      return this.geometryFactory.createPolygon()
    }

    var ring, linestring, linearring
    var rings = str.trim().split(regExes.parenComma)
    var shell
    var holes = []
    for (let i = 0, len = rings.length; i < len; ++i) {
      ring = rings[i].replace(regExes.trimParens, '$1')
      linestring = parse.linestring.call(this, ring)
      linearring = this.geometryFactory.createLinearRing(linestring._points)
      if (i === 0) {
        shell = linearring
      } else {
        holes.push(linearring)
      }
    }
    return this.geometryFactory.createPolygon(shell, holes)
  },

  /**
   * Return a multipolygon geometry given a multipolygon WKT fragment.
   *
   * @param {String} str A WKT fragment representing the multipolygon.
   * @return {MultiPolygon} A multipolygon geometry.
   * @private
   */
  multipolygon (str) {
    if (str === undefined) {
      return this.geometryFactory.createMultiPolygon()
    }

    var polygon
    var polygons = str.trim().split(regExes.doubleParenComma)
    var components = []
    for (let i = 0, len = polygons.length; i < len; ++i) {
      polygon = polygons[i].replace(regExes.trimParens, '$1')
      components.push(parse.polygon.call(this, polygon))
    }
    return this.geometryFactory.createMultiPolygon(components)
  },

  /**
   * Return a geometrycollection given a geometrycollection WKT fragment.
   *
   * @param {String} str A WKT fragment representing the geometrycollection.
   * @return {GeometryCollection}
   * @private
   */
  geometrycollection (str) {
    if (str === undefined) {
      return this.geometryFactory.createGeometryCollection()
    }

    // separate components of the collection with |
    str = str.replace(/,\s*([A-Za-z])/g, '|$1')
    var wktArray = str.trim().split('|')
    var components = []
    for (let i = 0, len = wktArray.length; i < len; ++i) {
      components.push(this.read(wktArray[i]))
    }
    return this.geometryFactory.createGeometryCollection(components)
  }
}
