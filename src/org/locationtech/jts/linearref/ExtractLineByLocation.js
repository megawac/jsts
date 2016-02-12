import LineString from '../geom/LineString';
import CoordinateList from '../geom/CoordinateList';
import LinearIterator from './LinearIterator';
import Assert from '../util/Assert';
import LinearGeometryBuilder from './LinearGeometryBuilder';
import MultiLineString from '../geom/MultiLineString';
export default class ExtractLineByLocation {
	constructor(...args) {
		this.line = null;
		switch (args.length) {
			case 1:
				return ((...args) => {
					let [line] = args;
					this.line = line;
				})(...args);
		}
	}
	get interfaces_() {
		return [];
	}
	static extract(line, start, end) {
		var ls = new ExtractLineByLocation(line);
		return ls.extract(start, end);
	}
	computeLinear(start, end) {
		var builder = new LinearGeometryBuilder(this.line.getFactory());
		builder.setFixInvalidLines(true);
		if (!start.isVertex()) builder.add(start.getCoordinate(this.line));
		for (var it = new LinearIterator(this.line, start); it.hasNext(); it.next()) {
			if (end.compareLocationValues(it.getComponentIndex(), it.getVertexIndex(), 0.0) < 0) break;
			var pt = it.getSegmentStart();
			builder.add(pt);
			if (it.isEndOfLine()) builder.endLine();
		}
		if (!end.isVertex()) builder.add(end.getCoordinate(this.line));
		return builder.getGeometry();
	}
	computeLine(start, end) {
		var coordinates = this.line.getCoordinates();
		var newCoordinates = new CoordinateList();
		var startSegmentIndex = start.getSegmentIndex();
		if (start.getSegmentFraction() > 0.0) startSegmentIndex += 1;
		var lastSegmentIndex = end.getSegmentIndex();
		if (end.getSegmentFraction() === 1.0) lastSegmentIndex += 1;
		if (lastSegmentIndex >= coordinates.length) lastSegmentIndex = coordinates.length - 1;
		if (!start.isVertex()) newCoordinates.add(start.getCoordinate(this.line));
		for (var i = startSegmentIndex; i <= lastSegmentIndex; i++) {
			newCoordinates.add(coordinates[i]);
		}
		if (!end.isVertex()) newCoordinates.add(end.getCoordinate(this.line));
		if (newCoordinates.size() <= 0) newCoordinates.add(start.getCoordinate(this.line));
		var newCoordinateArray = newCoordinates.toCoordinateArray();
		if (newCoordinateArray.length <= 1) {
			newCoordinateArray = [newCoordinateArray[0], newCoordinateArray[0]];
		}
		return this.line.getFactory().createLineString(newCoordinateArray);
	}
	extract(start, end) {
		if (end.compareTo(start) < 0) {
			return this.reverse(this.computeLinear(end, start));
		}
		return this.computeLinear(start, end);
	}
	reverse(linear) {
		if (linear instanceof LineString) return linear.reverse();
		if (linear instanceof MultiLineString) return linear.reverse();
		Assert.shouldNeverReachHere("non-linear geometry encountered");
		return null;
	}
	getClass() {
		return ExtractLineByLocation;
	}
}

