import { parse, isAfter, isValid } from "date-fns"
import { fields, VALIDTM } from "../constants"

const format = {RE: 102}
const isString = e => typeof e === "string"
const isNumber = e => typeof e === "number"

export const validate = {
  "TM": ({TM}) => !['DEP', 'DCA', 'POR'].includes(TM) && format, // Message type
  "RN": ({RN}) => !(isNumber(RN) && RN > 0) && format, // Message serial number
  "RC": ({RC}) => !(isString(RC) && (/^L?[LKM]\d{3,4}$/.test(RC))) && format, // Radio name
  "MA": ({MA}) => !(isString(MA) && MA !== "")&& format, // Captain's name
  "NA": ({NA}) => !(isString(NA) && NA !== "") && format, // Ship's name
  "DA": ({DA}) => !isValid(parse(DA, "yyyyMMdd", Date.now())) && format, // Date of timestamp
  "TI": ({TI}) => !isValid(parse(TI, "HHmm", Date.now())) && format, // Date of timestamp
  "PO": ({PO}) =>  !(isString(PO) && PO.length === 5) && format, // Land & port
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
  "OB": ({OB}) => !((isString(OB) && OB.replace(/ (\d)/g, "$1").split(" ").every(e => /^[A-Z]{3}\d+$/.test(e))) || OB === "") && format,
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
  "LA": ({LA}) => !(isString(LA) && /^[N]\d*\d*$/.test(LA)) && format,   // Latitude
  "LO": ({LO}) => !(isString(LO) && /^[E]\d*\d*$/.test(LO)) && format,   // Longitude
  "AC": ({AC}) => !(isString(AC) && AC.length === 3) && format,   // Fishing activity
  "DS": ({DS}) => !(isString(DS) && DS.length === 3) && format,    // Planned firh art
  "MV": ({MV}) => !(isNumber(MV) && MV >= 0) && format,  // Message version
  "AD": ({AD}) => !(isString(AD) && AD.length === 3) && format,
  "XR": ({XR}) => !(isString(XR) && XR !== "") && format,
  "QI": ({QI}) => !(isNumber(QI) && (QI <= 7 && QI >= 0)) && format, // Fishing permission int[1..7]
  "TS": () => null, // REVIEW;
  "BD": ({BD}) => !isValid(parse(BD, "yyyyMMdd")) && format, // Date of timestamp
  "BT": ({BT}) => !isValid(parse(BT, "HHmm")) && format, // Time of timestamp
  "ZO": ({ZO}) => !(isString(ZO) && ZO.length === 3) && format, // starting zone
  "LT": ({LT}) => !(isString(LT) && /^[E]\d{3,}$/.test(LT)) && format,   // Longitude
  "LG": ({LG}) => !(isString(LG) && /^[N]\d{3,}$/.test(LG)) && format,   // Latitude
  "GE": ({GE}) => !(isNumber(GE) && GE > 0) && format, // fishing tool
  "GP": ({GP}) => !(isNumber(GP) && (GP < 7 && GP > 0)) && format, // problem with tool
  "XT": ({XT}) => !(isString(XT) && /^[E]\d{3,}$/.test(XT)) && format,   // Longitude
  "XG": ({XG}) => !(isString(XG) && /^[N]\d{3,}$/.test(XG)) && format,   // Latitude
  "DU": ({DU}) => !(isNumber(DU) && DU > 0) && format, // Lengt of fishing (minutes)
  "CA": ({CA}) => !((isString(CA) && CA.replace(/ (\d)/g, "$1").split(" ").every(e => /^[A-Z]{3}\d+$/.test(e))) || CA === "") && format, // Same as OB?
  "ME": ({ME}) => !(isNumber(ME) && ME >= 0) && format, //width of mask
  "GS": ({GS}) => !(isNumber(GS) && (GS < 5 && GS > 0)) && format,
  "LS": ({LS}) => !(isString(LS) && LS !== "" && LS.length <= 60) && format,
  "KG": ({KG}) => !((isString(KG) && KG.replace(/ (\d)/g, "$1").split(" ").every(e => /^[A-Z]{3}\d+$/.test(e))) || KG === "") && format, // Same as OB?

}

/**
 * Helper function for validateMessage
 * @param {string} type
 */
export function checkMessage(message){
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
      console.log(`Messege is: ${JSON.stringify(error)}`)

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
