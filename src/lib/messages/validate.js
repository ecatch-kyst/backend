const validate = {
  "TM": () => false,
  "RN": v => false,
  "RC": v => false,
  "MA": v => false,
  "DA": v => false,
  "TI": v => false,
  "PO": v => false,
  "ZD": v => false,
  "ZT": v => false,
  "OB": v => false,
  "PD": v => false,
  "PT": v => false,
  "LA": v => false,
  "LO": v => false,
  "AC": v => false,
  "DS": v => false
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