import { AUTH_USER, USERS_FS, MESSAGES_FS, firestore, BOATS_FS } from "../firebase"

export const userCreated = AUTH_USER.onCreate(async ({uid, email}) => {

  const batch = firestore.batch()
  const boatRef = BOATS_FS.doc()
  batch.set(USERS_FS.doc(uid), {
    boatId: boatRef.id
  })
  batch.create(boatRef, {
    NA: `${uid}'s boat`,
    RC: "L337",
    XR: "aa-1337-bb",
    IMO: "",
    MMSI: "",
    draught: 1,
    airDraught: 5,
    RN: 1,
    recordNumberStartIsUnknown: false,
    userId: uid
  })

  await batch.commit()
  return console.log(`User ${email} added with ID: ${uid}`)
})

export const userDeleted = AUTH_USER.onDelete(async ({uid}) => {
  const {boatId} = (await USERS_FS.doc(uid).get()).data()

  const batch = firestore.batch()

  batch.delete(USERS_FS.doc(uid))

  batch.delete(BOATS_FS.doc(boatId))

  const messages = await MESSAGES_FS(uid).get()

  messages.forEach(message => {
    batch.delete(MESSAGES_FS(uid).doc(message.id))
  })


  await batch.commit()
  return console.log(`User ${uid} deleted`)
})