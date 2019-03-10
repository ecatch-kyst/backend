import { validate } from "../validate"
// Possible Errors
const e = {
  format: {RE: 102},
  malformed: {RE: 530},
  ahead: {RE: 151},
  old: {RE: 152}
}

const load = field => [[{[field]: "PO 200"}, e.format], [{[field]: "LKOS 2"}, e.format], [{[field]: "POR 200"}, true], [{[field]: ""}, true], [{[field]: "POR 200 POK 2000"}, true], [{[field]: "LKO 200000000"}, true]]
const longitude = field => [[{[field]: "N100"}, e.format], [{[field]: "e100"}, e.format], [{[field]: "E 100"}, e.format], [{[field]: "E100"}, true], [{[field]: "E999"}, true]]
const latitude = field => [[{[field]: "E100"}, e.format], [{[field]: "n100"}, e.format], [{[field]: "N 100"}, e.format], [{[field]: "N100"}, true], [{[field]: "N999"}, true]]
const values = [
  [
    "OB", load("OB")
  ],
  [
    "RN", [
      [{RN: -1}, e.format],
      [{RN: 1}, true],
      [{RN: 10000}, true],
    ]
  ],
  [
    "RC", [
      [{RC: "KKK1000"}, e.format],
      [{RC: "KL1000"}, {RE: 102}],
      [{RC: "LL1000"}, true],
      [{RC: "LM9999"}, true]
    ]
  ],
  [
    "MA", [
      [{MA: 1337}, e.format],
      [{MA: ""}, e.format],
      [{MA: "Dag Frode"}, true],
      [{MA: "Ola Nordmann"}, true],
    ]
  ],
  [
    "DA", [
      [{DA: "20000212"}, true],
      [{DA: "20021"}, e.format]
    ]
  ],
  [
    "TI", [
      [{TI: "1010"}, true],
      [{TI: "10102"}, e.format],
      [{TI: "0000"}, true],
      [{TI: "-0000"}, e.format],
    ]
  ],
  [
    "PO", [
      [{PO: 123}, e.format],
      [{PO: "NOTRD"}, true],
      [{PO: "Trondheim"}, e.format],
    ]
  ],
  [
    "ZD", [
      [{ZD:20194212, ZT: 1000}, e.format],
      //[{ZD:20500101, ZT: 1000}, e.ahead],
      //[{ZD:20190117, ZT: 1258}, true],
    ]
  ],

  // "PD", "PT"
  [
    "LA", latitude("LA")
  ],
  [
    "LO", longitude("LO")
  ],
  [
    "AC", [
      [{AC: 2}, e.format],
      [{AC: "e100"}, e.format],
      [{AC: "ACEV"}, e.format],
      [{AC: "ACE"}, true],
      [{AC: "PPP"}, true]
    ]
  ],
  [
    "DS", [
      [{DS: 232}, e.format],
      [{DS: "PL"}, e.format],
      [{DS: "OPFE"}, e.format],
      [{DS: "XRA"}, true],
      [{DS: "LAS"}, true]
    ]
  ],
  [
    "MV", [
      [{MV:"1"}, e.format],
      [{MV: -1}, e.format],
      [{MV: 0}, true],
      [{MV: 9999}, true]
    ]
  ],
  [
    "AD", [
      [{AD:"1"}, e.format],
      [{AD: 123}, e.format],
      [{AD: "NOTRD"}, e.format],
      [{AD: "NOR"}, true],
    ]
  ],
  [
    "NA", [
      [{NA: 0}, e.format],
      [{NA: ""}, e.format],
      [{NA: "Skippern"}, true],
      [{NA: "fæsk"}, true]
    ]
  ],
  [
    "XR", [
      [{XR: 1}, e.format],
      [{XR: ""}, e.format],
      [{XR: "LM200"}, true],
      [{XR: "NOR 2000"}, true]
    ]
  ],
  [
    "QI", [
      [{QI:-1}, e.format],
      [{QI: 8}, e.format],
      [{QI: 0}, true],
      [{QI: 4}, true]
    ]
  ],
  //"BD", "BT" samme som DA og TI så sjekken for DA TI er nok
  [
    "ZO", [
      [{ZO:-1}, e.format],
      [{ZO: ""}, e.format],
      [{ZO: "LOK"}, true],
      [{ZO: "POP"}, true]
    ]
  ],
  [
    "LT", longitude("LT")
  ],
  [
    "LG", latitude("LG")
  ],
  [
    "GE", [
      [{GE: "2"}, e.format],
      [{GE: 0}, e.format],
      [{GE: -1}, e.format],
      [{GE: 2}, true],
      [{GE: 3}, true]
    ]
  ],
  [
    "GP", [
      [{GP: -1}, e.format],
      [{GP: "2"}, e.format],
      [{GP: 10}, e.format],
      [{GP: 1}, true],
      [{GP: 4}, true],
      [{GP: 7}, e.format],
      [{GP: 0}, e.format],
      [{GP: 6}, true]
    ]
  ],
  [
    "XT", longitude("XT")
  ],
  [
    "XG", latitude("XG")
  ],
  [
    "DU", [
      [{DU: "2"}, e.format],
      [{DU: 0}, e.format],
      [{DU: 1}, true],
      [{DU: 2000}, true]
    ]
  ],
  [
    "CA", load("CA")
  ],
  [
    "ME", [
      [{ME: "2"}, e.format],
      [{ME: -1}, e.format],
      [{ME: 2}, true],
      [{ME: 10}, true]
    ]
  ],
  [
    "GS", [
      [{GS: "2"}, e.format],
      [{GS: 0}, e.format],
      [{GS: 5}, e.format],
      [{GS: 1}, true],
      [{GS: 4}, true]
    ]
  ],
  [
    "LS", [
      [{LS: ""}, e.format],
      [{LS: 0}, e.format],
      [{LS: "PNA"}, true],
      [{LS: "KNFEA"}, true],
      [{LS: "123456789012345678901234567890123456789012345678901234567890"}, true],
      [{LS: "1234567890123456789012345678901234567890123456789012345678901"}, e.format]
    ]
  ],
  [
    "KG", load("KG")
  ]
]

describe("Dualog validation", () => {
  values.forEach(([k, v]) => {
    describe(`(${k}) function`, () => {
      v.forEach(([arg, expected]) => {
        it(`"${JSON.stringify(arg)}" => ${JSON.stringify(expected)}`, () => expect(validate[k](arg)).toEqual(expected))
      })
    })
  })
})