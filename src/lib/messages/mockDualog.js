import { dualogStringify, dualogParse } from "./utils"
import { format } from "date-fns"


export default async function(req) {
  // add fake validation
  const parsed = dualogParse(req.body.PlainTextNaf)


  let response = {
    TM : "RET",
    RN : 1, //parsed.RN,
    FR : "NOR-DUALOG",
    RC : "feer", //parsed.RC,
    RS : "ACK",
    RE : 0,
    DA : format(Date.now(), "yyyyMMdd"),
    TI : format(Date.now(), "HHmm")
  }

  console.log(JSON.stringify(parsed))

  switch (parsed.TM) {
  // should send NAK on parse error
  // Add validation
  case "DEP":
    //SR
    //TM/DEP
    //RN/1
    //the regex checks if the string only contains numbers
    if(!/^\d+$/.test(parsed.RN) || parseInt(parsed.RN) < 0){
      response.RS = "NAK"
      console.log("error RN not a number or number less than 0" + parsed.NR)
    }
    //AD/NOR
    if(parsed.AD !== "NOR" && parsed.AD !== "SWE" && parsed.AD !=="DAN"){
      response.RS = "NAK"
      console.log("error AD not NOR, SWE or DAN")
    }
    //RC/feer
    if(typeof parsed.RC !=="string" || parsed.RC.length > 128){
      response.RS = "NAK"
      console.log("error RC not string or more than 128 characters")
    }
    //NA/Clean
    if(typeof parsed.NA !=="string" || parsed.NA.length > 128){
      response.RS = "NAK"
      console.log("error NA not a string or more than 128 characters")
    }
    //XR/KK1111KK
    if(typeof parsed.XR !=="string" || parsed.XR.length > 128){
      response.RS = "NAK"
      console.log("error XR not a string or more than 128 characters")
    }
    //MA/clean dag
    if(typeof parsed.MA !=="string" || parsed.MA.length > 128){
      response.RS = "NAK"
      console.log("error MA not a string or more than 128 characters")
    }
    /* change these to the way RN is
    //DA/20190117
    if(typeof parsed.DA !=="number" || parsed.DA.length !==8){
      response.RS = "NAK"
      console.log("error DA not a number or not the length of 8")
    }
    //TI/1013
    if(typeof parsed.TI !=="number" || parsed.TI.length !==4){
      response.RS = "NAK"
      console.log("error TI not a number or not the length of 4")
    }
    */
    //PO/NOTRD
    //ZD/20190117
    //ZT/1012
    //PD/20190117
    //PT/1213
    //LA/N1111
    //LO/E11111
    //AC/FIS
    //DS/SQE
    //OB/
    //ER//
    console.log("DEP received, parsing and checking the message.")
    break
  case "DCA":
    //SR
    //TM/DCA
    //RN/3
    //MV/1
    //AD/NOR
    //RC/feer
    //NA/Clean
    //XR/KK1111KK
    //MA/clean dag
    //DA/20190117
    //TI/1335
    //QI/1
    //AC/FIS
    //TS
    //BD/20190117
    //BT/1332
    //ZO/NOR
    //LT/+63.400
    //LG/+010.400
    //GE/OTB
    //GP/0
    //XT/+63.400
    //XG/+010.400
    //DU/1
    //CA/ARU 130000 RED 4 POK 600 WHB 2400
    //ME/5
    //GS/1
    //ER//
    console.log("DCA received, parsing and checking the message.")
    break
  case "POR":
    //SR
    //TM/POR
    //RN/4
    //AD/NOR
    //RC/feer
    //NA/Clean
    //XR/KK1111KK
    //MA/clean dag
    //DA/20190117
    //TI/1413
    //PO/NOAAA
    //PD/20190117
    //PT/1813
    //OB/ARU 130000 RED 60 POK 600 WHB 2400 SQE 55
    //LS/iii
    //KG/ARU 130000 RED 60 POK 600 WHB 2400 SQE 55
    //ER//
    console.log("POR received, parsing and checking the message.")
    break
  default:
    console.log("Unexpected request")
  }
  response = dualogStringify(response)

  return Promise.resolve(response)
}