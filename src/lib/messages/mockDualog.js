import { functions } from "../firebase"
import { dualogStringify, dualogParse } from "./utils"
import { format } from "date-fns"


export default async function(req) {
  // add fake validation
  const parsed = dualogParse(req.body.PlainTextNaf)


  let response = {
    TM : "RET",
    RN : parsed.RN,
    FR : "NOR-DUALOG",
    RC : parsed.RC,
    RS : "ACK",
    RE : 0,
    DA : format(Date.now(), "yyyyMMdd"),
    TI : format(Date.now(), "HHmm")
  }
  switch (parsed.TM) {
  // should send NAK on parse error
  // Add validation
  case "DEP":
    console.log("DEP received, parsing and checking the message.")
    break
  case "DCA":
    console.log("DCA received, parsing and checking the message.")
    break
  case "POR":
    console.log("POR received, parsing and checking the message.")
    break
  default:
    console.log("Unexpected request")
  }
  console.log(response)
  console.log(dualogStringify(response))

  response = dualogStringify(response)

  return Promise.resolve(response)
}