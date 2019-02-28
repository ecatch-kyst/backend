import * as admin from "firebase-admin"
import * as firebaseFunctions from "firebase-functions"
import credentials from "../service-account-credentials.json"

// NOTE: Change region to europe west1
export const functions = firebaseFunctions


const firebase = admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "https://ecatch-kyst.firebaseio.com",
  storageBucket: "ecatch-kyst.appspot.com",
})

export default firebase

export const firestore = firebase.firestore()

export const storage = firebase.storage()
export const database = firebase.database()

export const AUTH_USER = functions.auth.user()

export const USERS_FS = firestore.collection("users")

export const BOATS_FS = firestore.collection("boats")
export const MESSAGES_FS = userId => USERS_FS.doc(userId).collection("messages")
