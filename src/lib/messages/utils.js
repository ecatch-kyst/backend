Object.prototype.entries = function(obj) { //eslint-disable-line no-extend-native
  let ownProps = Object.keys( obj ),
    i = ownProps.length,
    resArray = new Array(i)
  while (i--)
    resArray[i] = [ownProps[i], obj[ownProps[i]]]
  return resArray
}


Object.prototype.fromEntries = function (iterable) { //eslint-disable-line no-extend-native
  return [...iterable]
    .reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {})
}

export function dualogStringify(object) {
  return `//SR//${Object.entries(object).reduce((a, [k, v]) => a.concat(`${k}/${v}//`), "")}ER//`
}

export function dualogParse(string) {
  return Object.fromEntries(
    string
      .replace(/\/\/SR\/\/(.*)\/\/ER\/\//, "$1")
      .split("//")
      .map(e => e.split("/"))
  )
}