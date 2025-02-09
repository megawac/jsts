import Exception from '../../../../../java/lang/Exception'
export default class NoninvertibleTransformationException extends Exception {
  constructor () {
    super()
    NoninvertibleTransformationException.constructor_.apply(this, arguments)
  }
  getClass () {
    return NoninvertibleTransformationException
  }
  get interfaces_ () {
    return []
  }
}
NoninvertibleTransformationException.constructor_ = function () {
  if (arguments.length === 0) {
    Exception.constructor_.call(this)
  } else if (arguments.length === 1) {
    let msg = arguments[0]
    Exception.constructor_.call(this, msg)
  }
}
