import isLength from './isLength'

function isArrayLike(value: unknown): value is ArrayLike<unknown> | string {
  // 排除 DOM 节点
  if (value && typeof value === 'object' && 'nodeType' in value) {
    return false
  }
  
  return value !== void 0 && value !== null && typeof value !== 'function' && isLength((value as ArrayLike<unknown>).length)
}

export default isArrayLike
