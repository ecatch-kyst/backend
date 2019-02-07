export function dualogStringify(object) {
  return `//SR//${Object.entries(object).reduce((a, [k, v]) => a.concat(`${k}/${v}//`), "")}ER//`
}

export function dualogParse(string) {
  return Object.fromEntries(string)
    .replace(/\/\/SR\/\/(.*)\/\/ER\/\//, "$1")
    .split("//")
    .map(e => e.split("/"))
}