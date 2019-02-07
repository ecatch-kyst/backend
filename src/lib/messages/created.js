import { MESSAGES_FS, functions } from "../firebase"
//import axios from "axios"
import { dualogStringify, dualogParse } from "./utils"
import { dualog } from "."

export default functions.firestore.document("messages/{messageId}")
  .onCreate(async (snap, {params: {messageId}}) => {

    try {
      /* let result = await axios({
        url: "dualog API",
        path: "/dualog",
        method: "post",
        data: {PlainTextNaf: dualogStringify(snap.data())}
      }) */

      let result = await dualog({
        body: {PlainTextNaf: dualogStringify(snap.data())}
      })

      result = dualogParse(result)

      await MESSAGES_FS.doc(messageId)
        .update({acknowledged: result.RS === "ACK"})

      console.log("Message was sent to Dualog. Response: ", result.data)

    } catch (error) {console.log(error)}

    return null
  })
