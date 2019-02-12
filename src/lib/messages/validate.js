import { parse, isAfter, isValid } from "date-fns"

const validate = {
  "TM": () => null, // Message type
  "RN": v => typeof v === "number" || v > 0 || {RE: 102}, // Message serial number
  "RC": v => (typeof v === "string" && v.test(/^L[LKM]\d{4}$/)) || {RE: 102}, // Radio name
  "MA": v => typeof v === "string" || {RE: 102}, // Captain's name
  "NA": v => typeof v === "string" || {RE: 102}, // Ship's name
  "DA": v => isValid(new Date(v)) || {RE: 102}, // Date of timestamp
  "TI": v => isValid(new Date(v)) || {RE: 102}, // Time of timestamp
  "PO": v =>  (typeof v === "string" && v.length === 5) || {RE: 102}, // Land & port
  "ZD": ({ZD, ZT}) => { // Date of departure
    const now = Date.now()
    const date = parse(ZD+ZT, "yyyyMMddHHmm", now)
    if (isValid(date)) {
      return isAfter(date, now) && {RE: 151}
    } else return {RE: 102}
  },
  "ZT": () => null,  // Time of departure // validating in ZD
  "OB": v => (v === "" && v.test(/([A-Z]{3} \d* )* /)) || {RE: 102},
  "PD": ({ZD, ZT, PD, PT}) => {  // Date of fishing start
    const now = Date.now()
    const departureDate = parse(ZD+ZT, "yyyyMMddHHmm", now)
    const startDate = parse(PD+PT, "yyyyMMddHHmm", now)
    if(isValid(departureDate) && isValid(startDate)) {
      return isAfter(departureDate, startDate) && {RE: 152}
    } else return {RE: 102}
  },
  "PT": () => null, // Time of fishing start // validating in PD
  "LA": () => null,
  "LO": () => null,
  "AC": () => null,
  "DS": () => null
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
    for (let i; i < requiredFields.length; i++) {
      const field = requiredFields[i]
      if(!message[field]){
        console.log(`${field} not found`)
        result = {...result, RS: "NAK", RE: 104}
        break
      } else {
        const fieldResult = validate[field](message)
        if (fieldResult) {
          result = {...result, ...fieldResult, RS: "NAK"}
        }
      }
    }

    break

  default:
    result = {...result, RE: 530, RS: "NAK"}
    break
  }
  console.log("Field checking is done")

  if (result.RS === "NAK") return result
  else return {RS: "ACK"}

}