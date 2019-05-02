import { MESSAGES_FS, functions, USERS_FS, BOATS_FS } from "../firebase"
import { dualogStringify, dualogParse } from "./utils"
import { dualog } from "."
import { format } from "date-fns"
import * as utm from "utm"

Object.entries = function (obj) { //eslint-disable-line no-extend-native
  let ownProps = Object.keys(obj),
    i = ownProps.length,
    resArray = new Array(i)
  while (i--)
    resArray[i] = [ownProps[i], obj[ownProps[i]]]
  return resArray
}

function convertDate(e){return format(e.toDate(), "yyyyMMdd")}
function convertTime(e){return format(e.toDate(), "HHmm")}
function stringifyCatch(c){return Object.entries(c).map(([k, v]) => [k, v].join(" ")).join(" ")}
function prependSign(number){return `${Math.sign(number) > 0 ? "+" : ""}${number}` }

export default functions.firestore.document("users/{userId}/messages/{messageId}")
  .onCreate(async (snap, {params: {userId, messageId}, eventId}) => {
    if(!(await MESSAGES_FS(userId).where("eventId", "==", eventId).get()).empty) return null
    try {
      let m = snap.data()

      console.log(`${m.TM} message created`)

      let boat = {}
      let wgs = {}

      await MESSAGES_FS(userId).doc(messageId).update({eventId})

      const boatQuery =  await BOATS_FS.where("userId", "==", userId).get()
      boatQuery.docs.forEach(b => {if (b.exists) boat = b.data()})

      let message = {
        TM: m.TM,
        RN: m.RN,
        AD: "NOR",
        RC: boat.RC,
        NA: boat.NA,
        MA: m.MA,
        DA: convertDate(m.created),
        TI: convertTime(m.created)
      }

      switch (m.TM) {
      case "DEP":
        wgs = utm.fromLatLon(m.expectedFishingSpot.latitude, m.expectedFishingSpot.longitude)
        message = {
          ...message,
          XR: boat.XR,
          PO: m.PO,
          ZD: convertDate(m.departure),
          ZT: convertTime(m.departure),
          PD: convertDate(m.expectedFishingStart),
          PT: convertTime(m.expectedFishingStart),
          LA: "N"+wgs.northing,
          LO: "E"+wgs.easting,
          AC: m.AC,
          DS: m.DS,
          OB: stringifyCatch(m.OB)
        }
        break

      case "DCA": {
        const {AD, QI, AC, TS, ZO, GE, GP, DU, ME, GS, fishingStart, startFishingSpot, endFishingSpot} = m
        message = {
          ...message,
          XR: boat.XR,
          AD,
          QI,
          AC,
          BD: convertDate(fishingStart),
          BT: convertTime(fishingStart),
          ZO,
          LT: prependSign(startFishingSpot.latitude), //LT/+63.400
          LG: prependSign(startFishingSpot.longitude), //LG/+010.400
          GE,
          GP,
          XG: prependSign(endFishingSpot.longitude), //Same as LG
          XT: prependSign(endFishingSpot.latitude), //Same as LT
          DU,
          GS
        }
        if(m.CA) m.CA = stringifyCatch(messages.CA)
        if(["OTB", "OTM", "SSC", "GEN", "TBS"].includes(GE)){
          message = {...message, ME}
        }
      }
        break

      case "POR": {
        const {PO, portArrival, LS,} = m
        message = {
          ...message,
          NA: boat.NA,
          XR: boat.NA,
          PO,
          PD: convertDate(portArrival),
          PT: convertTime(portArrival),
          OB: stringifyCatch(m.OB),
          LS,
          KG: stringifyCatch(m.KG)
        }
      }
        break

      default:
        break
      }
      console.log(`Sending ${dualogStringify(message)} to Dualog`)
      let result = await dualog({
        body: {PlainTextNaf: dualogStringify(message)}
      })

      result = dualogParse(result)

      await USERS_FS.doc(userId).collection("messages").doc(messageId).update({result})

      console.log(`Response from Dualog: ${JSON.stringify(result)}`)

      return null
    } catch (error) {
      const m = snap.data()
      const now = Date.now()
      return USERS_FS.doc(userId).collection("messages").doc(messageId).update({result:{
        TM : "RET",
        RN : m.RN,
        FR : "NOR-DUALOG",
        RC : m.RC,
        RS : "NAK",
        RE : 100,
        DA : format(now, "yyyyMMdd"),
        TI : format(now, "HHmm"),
        error
      }})
    }
  })
