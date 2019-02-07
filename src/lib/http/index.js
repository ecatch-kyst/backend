import * as functions from "firebase-functions"

export const getMessages = functions.https.onRequest(async (req, res) => {
  // Get messages
  //const messages = await BOATS_FS.where("length", ">", 10).get().data()
  // return messages

  //res.send(JSON.stringify(messages))
  res.send("Hello!")
})
