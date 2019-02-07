import * as functions from "firebase-functions";

export const getMessages = functions.https.onRequest(async (req, res) => {
  // Get messages
  //const messages = await BOATS_FS.where("length", ">", 10).get().data()
  // return messages
  
  //res.send(JSON.stringify(messages))
  res.send("Hello!")
})

export const dualog = functions.https.onRequest(async (req, res) => {
  // add fake validation
  const {userId, type} = req.body
  if(!userId){
    return res.send("no permission")
  }
  switch (type) {
    // should send NAK on parse error
    case "DEP":
      // Check DEP format
      console.log("DEP received, parsing and checking the message.")
      return res.send("ACK")

    case "DCA":
      // Check DCA format
      console.log("DCA received, parsing and checking the message.")
      return res.send("ACK")
    
    case "POR":
      // Check DCA format
      console.log("POR received, parsing and checking the message.")
      return res.send("ACK")

    case "RET":
      // Check DCA format
      console.log("RET received, returning ACK")
      return res.send("ACK")
       
    default:
    console.log("Unexpected request");
    return res.send("NAK")
  }
})
