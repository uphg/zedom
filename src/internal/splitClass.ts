function splitClass(string: string): string[] {
  return (string && string.split(' ').filter(item => !!item.trim?.())) || []
}

export default splitClass
