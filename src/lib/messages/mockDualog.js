import { dualogStringify, dualogParse } from "./utils"
import {validateMessage} from "./validate"
import { format } from "date-fns"


export default async function(req) {
  // add fake validation
  let parsed = dualogParse(req.body.PlainTextNaf)
  const now = Date.now()
  let response = {
    TM : "RET",
    RN : parsed.RN,
    FR : "NOR-DUALOG",
    RC : parsed.RC,
    RS : "ACK",
    RE : 0,
    DA : format(now, "yyyyMMdd"),
    TI : format(now, "HHmm")
  }
  response = {...response, ...validateMessage(parsed)}

  response = dualogStringify(response)

  return Promise.resolve(response)
}