import splitClass from './splitClass'
import isArray from './isArray'

function mergeClass(args: (string | string[])[]): string[] {
  const result: string[] = []
  
  for (const item of args) {
    if (isArray(item)) {
      for (const name of item) {
        result.push(...splitClass(name))
      }
    } else if (typeof item === 'string') {
      result.push(...splitClass(item))
    }
  }
  
  return result
}

export default mergeClass