import EdgeEnd from '../../geomgraph/EdgeEnd';
import Label from '../../geomgraph/Label';
import ArrayList from '../../../../../java/util/ArrayList';
export default class EdgeEndBuilder {
	constructor(...args) {
		switch (args.length) {
			case 0:
				return ((...args) => {
					let [] = args;
				})(...args);
		}
	}
	get interfaces_() {
		return [];
	}
	createEdgeEndForNext(edge, l, eiCurr, eiNext) {
		var iNext = eiCurr.segmentIndex + 1;
		if (iNext >= edge.getNumPoints() && eiNext === null) return null;
		var pNext = edge.getCoordinate(iNext);
		if (eiNext !== null && eiNext.segmentIndex === eiCurr.segmentIndex) pNext = eiNext.coord;
		var e = new EdgeEnd(edge, eiCurr.coord, pNext, new Label(edge.getLabel()));
		l.add(e);
	}
	createEdgeEndForPrev(edge, l, eiCurr, eiPrev) {
		var iPrev = eiCurr.segmentIndex;
		if (eiCurr.dist === 0.0) {
			if (iPrev === 0) return null;
			iPrev--;
		}
		var pPrev = edge.getCoordinate(iPrev);
		if (eiPrev !== null && eiPrev.segmentIndex >= iPrev) pPrev = eiPrev.coord;
		var label = new Label(edge.getLabel());
		label.flip();
		var e = new EdgeEnd(edge, eiCurr.coord, pPrev, label);
		l.add(e);
	}
	computeEdgeEnds(...args) {
		switch (args.length) {
			case 1:
				return ((...args) => {
					let [edges] = args;
					var l = new ArrayList();
					for (var i = edges; i.hasNext(); ) {
						var e = i.next();
						this.computeEdgeEnds(e, l);
					}
					return l;
				})(...args);
			case 2:
				return ((...args) => {
					let [edge, l] = args;
					var eiList = edge.getEdgeIntersectionList();
					eiList.addEndpoints();
					var it = eiList.iterator();
					var eiPrev = null;
					var eiCurr = null;
					if (!it.hasNext()) return null;
					var eiNext = it.next();
					do {
						eiPrev = eiCurr;
						eiCurr = eiNext;
						eiNext = null;
						if (it.hasNext()) eiNext = it.next();
						if (eiCurr !== null) {
							this.createEdgeEndForPrev(edge, l, eiCurr, eiPrev);
							this.createEdgeEndForNext(edge, l, eiCurr, eiNext);
						}
					} while (eiCurr !== null);
				})(...args);
		}
	}
	getClass() {
		return EdgeEndBuilder;
	}
}

