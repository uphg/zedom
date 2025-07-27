const reCamelize = /-(\w)/g

// See https://github.com/vuejs/core/blob/main/packages/shared/src/index.ts
function camelize (string: string) {
  return string.replace(reCamelize, (_, c) => (c ? c.toUpperCase() : ''))
}

export default camelize
