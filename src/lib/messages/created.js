import { MESSAGES_FS, functions } from "../firebase"
import axios from "axios"
import { dualogStringify } from "./utils"

export default functions.firestore.document("messages/{messageId}")
  .onCreate(async (snap, {params: {messageId}}) => {

    try {
      const result = await axios({
        url: "https://us-central1-ecatch-kyst.cloudfunctions.net",
        path: "/dualog",
        method: "post",
        data: {PlainTextNaf: dualogStringify(snap.data())}
      })
      await MESSAGES_FS.doc(messageId)
        .set({acknowleged: result.data === "ACK"})

      console.log("Message was sent to Dualog. Response: ", result.data)

    } catch (error) {console.log(error)}

    return null
  })