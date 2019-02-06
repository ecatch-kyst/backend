import * as admin from "firebase-admin"
import * as firebaseFunctions from "firebase-functions"
import credentials from "../service-account-credentials.json"


export const functions = firebaseFunctions.region("europe-west1")


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