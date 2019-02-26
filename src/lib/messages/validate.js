import { parse, isAfter, isValid } from "date-fns"
import { fields, VALIDTM } from "../constants"

const format = {RE: 102}
const notString = e => typeof e !== "string"
const notNumber = e => typeof e !== "number"

export const validate = {
  "TM": () => null, // Message type
  "RN": ({RN}) => (notNumber(RN) || RN < 0) && format, // Message serial number
  "RC": ({RC}) => (notString(RC) || !(/^L?[LKM]\d{3,4}$/.test(RC))) && format, // Radio name
  "MA": ({MA}) => notString(MA) && format, // Captain's name
  "NA": ({NA}) => (notString(NA) || NA === "") && format, // Ship's name
  "DA": ({DA}) => !isValid(parse(DA, "yyyyMMdd", Date.now())) && format, // Date of timestamp
  "TI": ({TI}) => !isValid(parse(TI, "HHmm", Date.now())) && format, // Date of timestamp
  "PO": ({PO}) =>  (notString(PO) && PO.length !== 5) && format, // Land & port
  "ZD": () => null, // REVIEW:
  /* { // Date of departure
    const now = Date.now()
    const date = parse(ZD+ZT, "yyyyMMddHHmm", now)
    console.log(ZD, ZT, date)
    if (isValid(date)) {
      return isAfter(date, now) && {RE: 151}
    } else return format
  }, */
  "ZT": () => null,  // REVIEW: Time of departure // validating in ZD
  "OB": ({OB}) => (notString(OB) || !OB.replace(/ (\d)/g, "$1").split(" ").every(e => /^[A-Z]{3}\d+$/.test(e))) && OB !== "" && format,
  "PD": ({ZD, ZT, PD, PT}) => null, // REVIEW:
  /* {  // Date of fishing start
    const now = Date.now()
    const departureDate = parse(ZD+ZT, "yyyyMMddHHmm", now)
    const startDate = parse(PD+PT, "yyyyMMddHHmm", now)
    if(isValid(departureDate) && isValid(startDate)) {
      return isAfter(departureDate, startDate) && {RE: 152}
    } else return format
  }, */
  "PT": () => null,   // Time of fishing start // validating in PD
  // REVIEW: LA and LO format
  "LA": ({LA}) => (notString(LA) || !/^[N]\d*[.]\d*$/.test(LA)) && format,   // Latitude
  "LO": ({LO}) => (notString(LO) || !/^[E]\d*[.]\d*$/.test(LO)) && format,   // Longitude
  "AC": ({AC}) => (notString(AC) || AC.length !== 3) && format,   // Fishing activity
  "DS": ({DS}) => (notString(DS) || DS.length !== 3) && format,    // Planned firh art
  "MV": ({MV}) => (notNumber(MV) || MV < 0) && format,  // Message version
  "AD": ({AD}) => (notString(AD) || AD.length !== 3) && format,
  "XR": ({XR}) => (notString(XR) || XR === "") && format,
  "QI": ({QI}) => (notNumber(QI) || QI > 7 || QI < 0) && format, // Fishing permission int[1..7]
  "TS": () => null,
  "BD": ({BD}) => !isValid(parse(BD, "yyyyMMdd")) && format, // Date of timestamp
  "BT": ({BT}) => !isValid(parse(BT, "HHmm")) && format, // Time of timestamp
  "ZO": ({ZO}) => (notString(ZO) || ZO.length !== 3) && format, // starting zone
  "LT": ({LT}) => (notString(LT) || !/^[E]\d{3,}$/.test(LT)) && format,   // Longitude
  "LG": ({LG}) => (notString(LG) || !/^[N]\d{3,}$/.test(LG)) && format,   // Latitude
  "GE": ({GE}) => notNumber(GE) && format, // fishing tool
  "GP": ({GP}) => (notNumber(GP) || GP > 7 || GP < 0) && format, // problem with tool
  "XT": ({XT}) => (notString(XT) || !/^[E]\d{3,}$/.test(XT)) && format,   // Longitude
  "XG": ({XG}) => (notString(XG) || !/^[N]\d{3,}$/.test(XG)) && format,   // Latitude
  "DU": ({DU}) => (notNumber(DU) || DU <= 0) && format, // Lengt of fishing (minutes)
  "CA": ({CA}) => (notString(CA) || !CA.replace(/ (\d)/g, "$1").split(" ").every(e => /^[A-Z]{3}\d+$/.test(e))) && CA !== "" && format, // Same as OB?
  "ME": ({ME}) => (notNumber(ME) || ME <= 0) && format, //width of mask
  "GS": ({GS}) => (notNumber(GS) || GS > 4 || GS <= 0) && format,
  "LS": ({LS}) => (notString(LS) || LS === "") && format,
  "KG": ({KG}) => (notString(KG) || !KG.replace(/ (\d)/g, "$1").split(" ").every(e => /^[A-Z]{3}\d+$/.test(e))) && KG !== "" && format, // Same as OB?

}

/**
 * Helper function for validateMessage
 * @param {string} type
 */
function checkMessage(message){
  const requiredFields = [...fields.common, ...fields[message.TM]]
  console.log(`Checking message`)
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]
    if(!message[field]){ // true if field is missing
      console.log(`${field} not found`)
      return  {RS: "NAK", RE: 104}
    } else {
      // Check if all fields are filled out correctly
      console.log(`Validating ${field}`)

      const error = validate[field](message)
      console.log(`error is: ${JSON.stringify(error)}`)

      if (error) return {...error, RS: "NAK"}
    }
  }
  return {}
}

/**
 *
 * @param {object} message
 */
export function validateMessage(message){
  const {TM} = message
  console.log(`Validating ${TM} message ${JSON.stringify(message)}`)
  let result = {}
  if(VALIDTM.includes(TM)){
    result = checkMessage(message)
  } else {
    result = {RE: 530, RS: "NAK"}
  }
  console.log("Field checking is done")

  if (result.RS === "NAK") return result
  else return {RS: "ACK"}

}
