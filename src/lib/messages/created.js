import { MESSAGES_FS, functions, USERS_FS, BOATS_FS } from "../firebase"
import { dualogStringify, dualogParse } from "./utils"
import { dualog } from "."
import { format, parse, setMinutes, setHours } from "date-fns"
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


export default functions.firestore.document("users/{userId}/messages/{messageId}")
  .onCreate(async (snap, {params: {userId, messageId}}) => {

    try {
      let m = snap.data()
      console.log(`${m.TM} message created`)

      let boat = {}
      let wgs = {}

      let user = (await USERS_FS.doc(userId).get()).data() // Fetch last serial number

      const RN = user.RN ? user.RN + 1 : 1

      await USERS_FS.doc(userId).update({RN})


      const boatQuery =  await BOATS_FS.where("userId", "==", userId).get()
      boatQuery.docs.forEach(b => {if (b.exists) boat = b.data()})


      let message = {
        TM: m.TM,
        RN,
        AD: "NOR",
        RC: boat.RC,
        MA: m.MA,
        DA: convertDate(m.created),
        TI: convertTime(m.created)
      }


      switch (m.TM) {
      case "DEP":
        wgs = utm.fromLatLon(m.expectedFishingSpot.latitude, m.expectedFishingSpot.longitude)
        message = {
          ...message,
          NA: boat.NA,
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
          OB: Object.entries(m.OB).map(([k, v]) => [k, v].join(" ")).join(" ")
        }
        break
      case "POR": {
        message = {
          ...message,
          NA: boat.NA,
          XR: boat.NA, AD, PO,
          PD: convertDate(portArrival),
          PT: convertTime(portArrival),
          OB, LS, KG
        }
      }
        break

      default:
        break
      }


      let result = await dualog({
        body: {PlainTextNaf: dualogStringify(message)}
      })

      result = dualogParse(result)

      const HH = parseInt(String(result.TI).slice(0,2), 10)
      const mm = parseInt(String(result.TI).slice(2,4), 10)

      const dualogTimestamp = setMinutes(setHours(parse(result.DA, "yyyyMMdd", Date.now()), HH), mm)

      await USERS_FS.doc(userId).collection("messages").doc(messageId)
        .update({
          RN,
          acknowledged: result.RS === "ACK",
          error: result.RE,
          dualogTimestamp
        })

      console.log("Message was sent to Dualog. Response: ", result)

    } catch (error) {console.log(error)}

    return null
  })
