import validate from "."

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
      .split("//")
      .map(e => e.split("/"))
  )
}

/**
 *
 * @param {object} message
 */
export function validateMessage(message){
  console.log(`Validating DEP message ${message}`)

  const requiredFields = ["TM", "RN", "RC", "MA", "DA", "TI", "PO", "ZD", "ZT", "OB", "PD", "PT", "LA", "LO", "AC", "DS"]

  let result = {}

  switch (message.TM) {
  case "DEP":
    // For hvert element i required
    requiredFields.forEach(field => {
      if(!message[field]){
        console.log(`${field} not found`)
        result = {...result, RS: "NAK", RE: 104}
      } else {
        const fieldResult = validate[field](message[field])
        if (fieldResult) {
          result = {...result, ...fieldResult, RS: "NAK"}
        }
      }
    })

    break

  default:
    result = {...result, RE: 530, RS: "NAK"}
    break
  }
  console.log("Field checking is done")

  if (result.RS === "NAK") return result
  else return {RS: "ACK"}

}


