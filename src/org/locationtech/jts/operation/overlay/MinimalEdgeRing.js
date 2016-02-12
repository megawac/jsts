import EdgeRing from '../../geomgraph/EdgeRing';
export default class MinimalEdgeRing extends EdgeRing {
	constructor(...args) {
		super();
		switch (args.length) {
			case 2:
				return ((...args) => {
					let [start, geometryFactory] = args;
					super(start, geometryFactory);
				})(...args);
		}
	}
	get interfaces_() {
		return [];
	}
	setEdgeRing(de, er) {
		de.setMinEdgeRing(er);
	}
	getNext(de) {
		return de.getNextMin();
	}
	getClass() {
		return MinimalEdgeRing;
	}
}

