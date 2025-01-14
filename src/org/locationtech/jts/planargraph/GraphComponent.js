export default class GraphComponent {
  constructor () {
    GraphComponent.constructor_.apply(this, arguments)
  }
  static getComponentWithVisitedState (i, visitedState) {
    while (i.hasNext()) {
      var comp = i.next()
      if (comp.isVisited() === visitedState) return comp
    }
    return null
  }
  static setVisited (i, visited) {
    while (i.hasNext()) {
      var comp = i.next()
      comp.setVisited(visited)
    }
  }
  static setMarked (i, marked) {
    while (i.hasNext()) {
      var comp = i.next()
      comp.setMarked(marked)
    }
  }
  setVisited (isVisited) {
    this._isVisited = isVisited
  }
  isMarked () {
    return this._isMarked
  }
  setData (data) {
    this._data = data
  }
  getData () {
    return this._data
  }
  setMarked (isMarked) {
    this._isMarked = isMarked
  }
  getContext () {
    return this._data
  }
  isVisited () {
    return this._isVisited
  }
  setContext (data) {
    this._data = data
  }
  getClass () {
    return GraphComponent
  }
  get interfaces_ () {
    return []
  }
}
GraphComponent.constructor_ = function () {
  this._isMarked = false
  this._isVisited = false
  this._data = null
}
