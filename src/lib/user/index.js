import { AUTH_USER, USERS_FS } from "../firebase"

export const userCreated = AUTH_USER.onCreate(async ({uid, email}) => {
  await USERS_FS.doc(uid).set({})
  return console.log(`User ${email} added with ID: ${uid}`)
})

export const userDeleted = AUTH_USER.onDelete(async ({uid}) => {
  await USERS_FS.doc(uid).delete()
  return console.log(`UserId ${uid} deleted`)
})