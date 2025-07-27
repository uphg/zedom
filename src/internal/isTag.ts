// Check if the value's Object.prototype.toString is of [object type] type
function isTag(value: unknown, type: string) {
  return Object.prototype.toString.call(value) === `[object ${type}]`
}

export default isTag
