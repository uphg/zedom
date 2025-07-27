import trim from './trim'

function splitClass(string: string): string[] {
  return (string && string.split(' ').filter(item => !!trim(item))) || []
}

export default splitClass
