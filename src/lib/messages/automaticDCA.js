/* eslint-disable promise/always-return */
import { USERS_FS } from "../firebase"

/**
 * Cloud function that checks if any users have DEP as their last message type at a given time before midnight,
 * and add empty DCA to Firestore if true
 */
export default function automaticDCA() {
  console.log("Automatic DCA initialized")

  function checkMessages() {
    const usersSnapshot = USERS_FS.get()
    return usersSnapshot.docs.forEach(doc => {
      console.log(doc.data())
      let userid = doc.data()[0]
      USERS_FS.doc(userid).collection("messages")
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get()
        .then(snap => {
          snap.forEach((doc) => {
            if (doc.data().TM === "DEP") {
              generateAutomaticDCA(userid)
            }
          })
        })
        .catch((error) => {
          console.log("Error getting documents: ", error)
        })
    })
  }

  async function generateAutomaticDCA(userid) {
    await USERS_FS.doc(userid).collection("messages").add({
      TM: "DCA",
      created: new Date()
    })
      .then(() => {
        console.log("DCA added for user", userid)
      })
      .catch((error) => {
        console.error("Error adding document:", error)
      })
    console.log("Automatic DCA sent for userid", userid)
  }
}