import Coordinate from '../geom/Coordinate';
import Polygon from '../geom/Polygon';
import Double from '../../../../java/lang/Double';
import LineSegment from '../geom/LineSegment';
import ConvexHull from './ConvexHull';
export default class MinimumDiameter {
	constructor(...args) {
		this.inputGeom = null;
		this.isConvex = null;
		this.convexHullPts = null;
		this.minBaseSeg = new LineSegment();
		this.minWidthPt = null;
		this.minPtIndex = null;
		this.minWidth = 0.0;
		const overloaded = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [inputGeom] = args;
						overloaded.call(this, inputGeom, false);
					})(...args);
				case 2:
					return ((...args) => {
						let [inputGeom, isConvex] = args;
						this.inputGeom = inputGeom;
						this.isConvex = isConvex;
					})(...args);
			}
		};
		return overloaded.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static nextIndex(pts, index) {
		index++;
		if (index >= pts.length) index = 0;
		return index;
	}
	static computeC(a, b, p) {
		return a * p.y - b * p.x;
	}
	static getMinimumDiameter(geom) {
		return new MinimumDiameter(geom).getDiameter();
	}
	static getMinimumRectangle(geom) {
		return new MinimumDiameter(geom).getMinimumRectangle();
	}
	static computeSegmentForLine(a, b, c) {
		var p0 = null;
		var p1 = null;
		if (Math.abs(b) > Math.abs(a)) {
			p0 = new Coordinate(0.0, c / b);
			p1 = new Coordinate(1.0, c / b - a / b);
		} else {
			p0 = new Coordinate(c / a, 0.0);
			p1 = new Coordinate(c / a - b / a, 1.0);
		}
		return new LineSegment(p0, p1);
	}
	getWidthCoordinate() {
		this.computeMinimumDiameter();
		return this.minWidthPt;
	}
	getSupportingSegment() {
		this.computeMinimumDiameter();
		return this.inputGeom.getFactory().createLineString([this.minBaseSeg.p0, this.minBaseSeg.p1]);
	}
	getDiameter() {
		this.computeMinimumDiameter();
		if (this.minWidthPt === null) return this.inputGeom.getFactory().createLineString(null);
		var basePt = this.minBaseSeg.project(this.minWidthPt);
		return this.inputGeom.getFactory().createLineString([basePt, this.minWidthPt]);
	}
	computeWidthConvex(convexGeom) {
		if (convexGeom instanceof Polygon) this.convexHullPts = convexGeom.getExteriorRing().getCoordinates(); else this.convexHullPts = convexGeom.getCoordinates();
		if (this.convexHullPts.length === 0) {
			this.minWidth = 0.0;
			this.minWidthPt = null;
			this.minBaseSeg = null;
		} else if (this.convexHullPts.length === 1) {
			this.minWidth = 0.0;
			this.minWidthPt = this.convexHullPts[0];
			this.minBaseSeg.p0 = this.convexHullPts[0];
			this.minBaseSeg.p1 = this.convexHullPts[0];
		} else if (this.convexHullPts.length === 2 || this.convexHullPts.length === 3) {
			this.minWidth = 0.0;
			this.minWidthPt = this.convexHullPts[0];
			this.minBaseSeg.p0 = this.convexHullPts[0];
			this.minBaseSeg.p1 = this.convexHullPts[1];
		} else this.computeConvexRingMinDiameter(this.convexHullPts);
	}
	computeConvexRingMinDiameter(pts) {
		this.minWidth = Double.MAX_VALUE;
		var currMaxIndex = 1;
		var seg = new LineSegment();
		for (var i = 0; i < pts.length - 1; i++) {
			seg.p0 = pts[i];
			seg.p1 = pts[i + 1];
			currMaxIndex = this.findMaxPerpDistance(pts, seg, currMaxIndex);
		}
	}
	computeMinimumDiameter() {
		if (this.minWidthPt !== null) return null;
		if (this.isConvex) this.computeWidthConvex(this.inputGeom); else {
			var convexGeom = new ConvexHull(this.inputGeom).getConvexHull();
			this.computeWidthConvex(convexGeom);
		}
	}
	getLength() {
		this.computeMinimumDiameter();
		return this.minWidth;
	}
	findMaxPerpDistance(pts, seg, startIndex) {
		var maxPerpDistance = seg.distancePerpendicular(pts[startIndex]);
		var nextPerpDistance = maxPerpDistance;
		var maxIndex = startIndex;
		var nextIndex = maxIndex;
		while (nextPerpDistance >= maxPerpDistance) {
			maxPerpDistance = nextPerpDistance;
			maxIndex = nextIndex;
			nextIndex = MinimumDiameter.nextIndex(pts, maxIndex);
			nextPerpDistance = seg.distancePerpendicular(pts[nextIndex]);
		}
		if (maxPerpDistance < this.minWidth) {
			this.minPtIndex = maxIndex;
			this.minWidth = maxPerpDistance;
			this.minWidthPt = pts[this.minPtIndex];
			this.minBaseSeg = new LineSegment(seg);
		}
		return maxIndex;
	}
	getMinimumRectangle() {
		this.computeMinimumDiameter();
		if (this.minWidth === 0.0) {
			if (this.minBaseSeg.p0.equals2D(this.minBaseSeg.p1)) {
				return this.inputGeom.getFactory().createPoint(this.minBaseSeg.p0);
			}
			return this.minBaseSeg.toGeometry(this.inputGeom.getFactory());
		}
		var dx = this.minBaseSeg.p1.x - this.minBaseSeg.p0.x;
		var dy = this.minBaseSeg.p1.y - this.minBaseSeg.p0.y;
		var minPara = Double.MAX_VALUE;
		var maxPara = -Double.MAX_VALUE;
		var minPerp = Double.MAX_VALUE;
		var maxPerp = -Double.MAX_VALUE;
		for (var i = 0; i < this.convexHullPts.length; i++) {
			var paraC = MinimumDiameter.computeC(dx, dy, this.convexHullPts[i]);
			if (paraC > maxPara) maxPara = paraC;
			if (paraC < minPara) minPara = paraC;
			var perpC = MinimumDiameter.computeC(-dy, dx, this.convexHullPts[i]);
			if (perpC > maxPerp) maxPerp = perpC;
			if (perpC < minPerp) minPerp = perpC;
		}
		var maxPerpLine = MinimumDiameter.computeSegmentForLine(-dx, -dy, maxPerp);
		var minPerpLine = MinimumDiameter.computeSegmentForLine(-dx, -dy, minPerp);
		var maxParaLine = MinimumDiameter.computeSegmentForLine(-dy, dx, maxPara);
		var minParaLine = MinimumDiameter.computeSegmentForLine(-dy, dx, minPara);
		var p0 = maxParaLine.lineIntersection(maxPerpLine);
		var p1 = minParaLine.lineIntersection(maxPerpLine);
		var p2 = minParaLine.lineIntersection(minPerpLine);
		var p3 = maxParaLine.lineIntersection(minPerpLine);
		var shell = this.inputGeom.getFactory().createLinearRing([p0, p1, p2, p3, p0]);
		return this.inputGeom.getFactory().createPolygon(shell, null);
	}
	getClass() {
		return MinimumDiameter;
	}
}

