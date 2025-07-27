export default function test(describe: string, func: Function) {
  let error
  let status = true
  try {
    func()
  } catch(e) {
    error = e
    status = false
  }

  console.log(`%c${status ? '√' : '×'}`, status ? 'color: #67c23a;' : 'color: #f56c6c;', describe)
  error && console.error(error)
}
