Object.entries = function (obj) { //eslint-disable-line no-extend-native
  let ownProps = Object.keys(obj),
    i = ownProps.length,
    resArray = new Array(i)
  while (i--)
    resArray[i] = [ownProps[i], obj[ownProps[i]]]
  return resArray
}


Object.fromEntries = function (iterable) { //eslint-disable-line no-extend-native
  return [...iterable]
    .reduce((obj, [key, val]) => ({...obj, [key]: val}), {})
}

export function dualogStringify(object) {
  return `//SR//${Object.entries(object).reduce((a, [k, v]) => a.concat(`${k}/${v}//`), "")}ER//`
}

export function dualogParse(string) {
  return Object.fromEntries(
    string
      .replace(/\/\/SR\/\/(.*)\/\/ER\/\//, "$1")
      .split(/\/\/(?=[A-Z]{2})/)
      .map(e => e.split("/"))
      .map(([k, v]) => [k, (isNaN(v) || v === "") ? (v || "") : /^0{1}\d{3}$/.test(v) ? v : parseFloat(v, 10)])
  )
}