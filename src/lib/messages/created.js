import { MESSAGES_FS, functions, USERS_FS, BOATS_FS, firestore } from "../firebase"
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

export default functions.firestore.document("users/{userId}/messages/{messageId}")
  .onCreate(async (snap, {params: {userId, messageId}}) => {
    try {
      let m = snap.data()

      console.log(`${m.TM} message created`)

      let boat = {}
      let wgs = {}

      let user = (await USERS_FS.doc(userId).get()).data() // Fetch last serial number

      const RN = user.RN ? user.RN + 1 : 1

      const batch = firestore.batch()
      batch.update(USERS_FS.doc(userId), {RN})
      batch.update(MESSAGES_FS(userId).doc(messageId), {RN})
      await batch.commit()

      const boatQuery =  await BOATS_FS.where("userId", "==", userId).get()
      boatQuery.docs.forEach(b => {if (b.exists) boat = b.data()})


      let message = {
        TM: m.TM,
        RN,
        AD: "NOR",
        RC: boat.RC,
        NA: boat.NA,
        MA: m.MA,
        DA: format(m.created.toDate(), "yyyyMMdd"),
        TI: format(m.created.toDate(), "HHmm")
      }

      switch (m.TM) {
      case "DEP":
        wgs = utm.fromLatLon(m.expectedFishingSpot.latitude, m.expectedFishingSpot.longitude)
        message = {
          ...message,
          XR: boat.XR,
          PO: m.PO,
          ZD: format(m.departure.toDate(), "yyyyMMdd"),
          ZT: format(m.departure.toDate(), "HHmm"),
          PD: format(m.expectedFishingStart.toDate(), "yyyyMMdd"),
          PT: format(m.expectedFishingStart.toDate(), "HHmm"),
          LA: "N"+wgs.northing,
          LO: "E"+wgs.easting,
          AC: m.AC,
          DS: m.DS,
          OB: Object.entries(m.OB).map(([k, v]) => [k, v].join(" ")).join(" ")
        }
        break

      case "DCA": {
        const {AD, QI, AC, TS, ZO, GE, GP, DU, CA, ME, GS, fishingStart, startFishingSpot, endFishingSpot} = m
        message = {
          ...message,
          XR: boat.XR,
          AD,
          QI,
          AC,
          TS,
          BD: format(fishingStart.toDate(), "YYYYMMDD", {awareOfUnicodeTokens: true}),
          BT: format(fishingStart.toDate(), "HHmm"),
          ZO,
          LT: startFishingSpot.latitude, //LT/+63.400
          LG: startFishingSpot.longitude, //LG/+010.400
          GE,
          GP,
          XT: endFishingSpot.latitude, //Same as LT
          XG: endFishingSpot.longitude, //Same as LG
          DU,
          CA,
          ME,
          GS
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

      await USERS_FS.doc(userId).collection("messages").doc(messageId).update({result})

      console.log("Message was sent to Dualog. Response: ", result)

    } catch (error) {console.log(error)}

    return null
  })
