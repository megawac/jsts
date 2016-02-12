import CGAlgorithms from './CGAlgorithms';
export default class Angle {
	get interfaces_() {
		return [];
	}
	static toDegrees(radians) {
		return radians * 180 / Math.PI;
	}
	static normalize(angle) {
		while (angle > Math.PI) angle -= Angle.PI_TIMES_2;
		while (angle <= -Math.PI) angle += Angle.PI_TIMES_2;
		return angle;
	}
	static angle(...args) {
		switch (args.length) {
			case 1:
				return ((...args) => {
					let [p] = args;
					return Math.atan2(p.y, p.x);
				})(...args);
			case 2:
				return ((...args) => {
					let [p0, p1] = args;
					var dx = p1.x - p0.x;
					var dy = p1.y - p0.y;
					return Math.atan2(dy, dx);
				})(...args);
		}
	}
	static isAcute(p0, p1, p2) {
		var dx0 = p0.x - p1.x;
		var dy0 = p0.y - p1.y;
		var dx1 = p2.x - p1.x;
		var dy1 = p2.y - p1.y;
		var dotprod = dx0 * dx1 + dy0 * dy1;
		return dotprod > 0;
	}
	static isObtuse(p0, p1, p2) {
		var dx0 = p0.x - p1.x;
		var dy0 = p0.y - p1.y;
		var dx1 = p2.x - p1.x;
		var dy1 = p2.y - p1.y;
		var dotprod = dx0 * dx1 + dy0 * dy1;
		return dotprod < 0;
	}
	static interiorAngle(p0, p1, p2) {
		var anglePrev = Angle.angle(p1, p0);
		var angleNext = Angle.angle(p1, p2);
		return Math.abs(angleNext - anglePrev);
	}
	static normalizePositive(angle) {
		if (angle < 0.0) {
			while (angle < 0.0) angle += Angle.PI_TIMES_2;
			if (angle >= Angle.PI_TIMES_2) angle = 0.0;
		} else {
			while (angle >= Angle.PI_TIMES_2) angle -= Angle.PI_TIMES_2;
			if (angle < 0.0) angle = 0.0;
		}
		return angle;
	}
	static angleBetween(tip1, tail, tip2) {
		var a1 = Angle.angle(tail, tip1);
		var a2 = Angle.angle(tail, tip2);
		return Angle.diff(a1, a2);
	}
	static diff(ang1, ang2) {
		var delAngle = null;
		if (ang1 < ang2) {
			delAngle = ang2 - ang1;
		} else {
			delAngle = ang1 - ang2;
		}
		if (delAngle > Math.PI) {
			delAngle = 2 * Math.PI - delAngle;
		}
		return delAngle;
	}
	static toRadians(angleDegrees) {
		return angleDegrees * Math.PI / 180.0;
	}
	static getTurn(ang1, ang2) {
		var crossproduct = Math.sin(ang2 - ang1);
		if (crossproduct > 0) {
			return Angle.COUNTERCLOCKWISE;
		}
		if (crossproduct < 0) {
			return Angle.CLOCKWISE;
		}
		return Angle.NONE;
	}
	static angleBetweenOriented(tip1, tail, tip2) {
		var a1 = Angle.angle(tail, tip1);
		var a2 = Angle.angle(tail, tip2);
		var angDel = a2 - a1;
		if (angDel <= -Math.PI) return angDel + Angle.PI_TIMES_2;
		if (angDel > Math.PI) return angDel - Angle.PI_TIMES_2;
		return angDel;
	}
	getClass() {
		return Angle;
	}
}
Angle.PI_TIMES_2 = 2.0 * Math.PI;
Angle.PI_OVER_2 = Math.PI / 2.0;
Angle.PI_OVER_4 = Math.PI / 4.0;
Angle.COUNTERCLOCKWISE = CGAlgorithms.COUNTERCLOCKWISE;
Angle.CLOCKWISE = CGAlgorithms.CLOCKWISE;
Angle.NONE = CGAlgorithms.COLLINEAR;

