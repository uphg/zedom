import isTag from './isTag'

function isArray(value: unknown) {
  return isTag(value, 'Array')
}

export default Array.isArray || isArray