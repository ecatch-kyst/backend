import { dualogStringify, dualogParse } from "./utils"
import {validateMessage} from "./validate"
import { format } from "date-fns"


export default async function(req) {
  // add fake validation
  let parsed = dualogParse(req.body.PlainTextNaf)


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

  console.log(JSON.stringify(parsed))

  response = {...response, ...validateMessage(parsed)}

  response = dualogStringify(response)

  return Promise.resolve(response)
}