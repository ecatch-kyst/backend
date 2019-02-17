import { validate } from "../validate"
// Possible Errors
const e = {
  format: {RE: 102},
  malformed: {RE: 530},
  ahead: {RE: 151},
  old: {RE: 152}
}

const values = [
  [
    "OB", [
      [{OB: "PO 200"}, e.format],
      [{OB: "LKOS 2"}, e.format],
      [{OB: "POR 200"}, false],
      [{OB: ""}, false],
      [{OB: "POR 200 POK 2000"}, false],
      [{OB: "LKO 200000000"}, false],
    ]
  ],
  [
    "RN", [
      [{RN: -1}, e.format],
      [{RN: 1}, false],
      [{RN: 10000}, false],
    ]
  ],
  [
    "RC", [
      [{RC: "KKK1000"}, e.format],
      [{RC: "KL1000"}, {RE: 102}],
      [{RC: "LL1000"}, false],
      [{RC: "LM9999"}, false]
    ]
  ],
  [
    "MA", [
      [{MA: 1337}, e.format],
      [{MA: "Dag Frode"}, false],
      [{MA: "Ola Nordmann"}, false],
    ]
  ],
  /* [
    "DA", [
      []
    ]
  ],
  [
    "TI", [
      []
    ]
  ], */
  [
    "PO", [
      [{PO: 123}, e.format],
      [{PO: "NOTRD"}, false],
      [{PO: "Trondheim"}, false],
    ]
  ],
  [
    "ZD", [
      [{ZD:20194212, ZT: 1000}, e.format],
      //[{ZD:20500101, ZT: 1000}, e.ahead],
      //[{ZD:20190117, ZT: 1258}, false],
    ]
  ],

  // "PD", "PT"
  [
    "LA", [
      [{LA: "E100"}, e.format],
      [{LA: "n100"}, e.format],
      [{LA: "N 100"}, e.format],
      [{LA: "N100"}, false],
      [{LA: "N999"}, false]
    ]
  ],
  [
    "LO", [
      [{LO: "N100"}, e.format],
      [{LO: "e100"}, e.format],
      [{LO: "E 100"}, e.format],
      [{LO: "E100"}, false],
      [{LO: "E999"}, false]
    ]
  ],
  [
    "AC", [
      [{AC: 2}, e.format],
      [{AC: "e100"}, e.format],
      [{AC: "ACEV"}, e.format],
      [{AC: "ACE"}, false],
      [{AC: "PPP"}, false]
    ]
  ],
  [
    "DS", [
      [{DS: 232}, e.format],
      [{DS: "PL"}, e.format],
      [{DS: "OPFE"}, e.format],
      [{DS: "XRA"}, false],
      [{DS: "LAS"}, false]
    ]
  ],
  [
    "MV", [
      [{MV:"1"}, e.format],
      [{MV: -1}, e.format],
      [{MV: 0}, false],
      [{MV: 9999}, false]
    ]
  ],
  [
    "AD", [
      [{AD:"1"}, e.format],
      [{AD: 123}, e.format],
      [{AD: "NOTRD"}, e.format],
      [{AD: "NOR"}, false],
    ]
  ],
  [
    "NA", [
      [{NA: 0}, e.format],
      [{NA: ""}, e.format],
      [{NA: "Skippern"}, false],
      [{NA: "fæsk"}, false]
    ]
  ],
  [
    "XR", [
      [{XR: 1}, e.format],
      [{XR: ""}, e.format],
      [{XR: "LM200"}, false],
      [{XR: "NOR 2000"}, false]
    ]
  ],
  [
    "QI", [
      [{QI:-1}, e.format],
      [{QI: 8}, e.format],
      [{QI: 0}, false],
      [{QI: 4}, false]
    ]
  ],
  //"BD", "BT"
  [
    "ZO", [
      [{ZO:-1}, e.format],
      [{ZO: ""}, e.format],
      [{ZO: "LOK"}, false],
      [{ZO: "POP"}, false]
    ]
  ],
  [
    "LT", [
      [{LT: "N100"}, e.format],
      [{LT: "e100"}, e.format],
      [{LT: "E 100"}, e.format],
      [{LT: "E100"}, false],
      [{LT: "E999"}, false]

    ]
  ],
  [
    "LG", [
      [{LG: "E100"}, e.format],
      [{LG: "n100"}, e.format],
      [{LG: "N 100"}, e.format],
      [{LG: "N100"}, false],
      [{LG: "N999"}, false]
    ]
  ],
  [
    "GE", [
      [{GE: "2"}, e.format],
      [{GE: 2}, false],
      [{GE: 3}, false]
    ]
  ],
  [
    "GP", [
      [{GP:-1}, e.format],
      [{GP: "2"}, e.format],
      [{GP: 10}, e.format],
      [{GP: 1}, false],
      [{GP: 4}, false]
    ]
  ],
  [
    "XT", [
      [{XT: "N100"}, e.format],
      [{XT: "e100"}, e.format],
      [{XT: "E 100"}, e.format],
      [{XT: "E100"}, false],
      [{XT: "E999"}, false]

    ]
  ],
  [
    "XG", [
      [{XG: "E100"}, e.format],
      [{XG: "n100"}, e.format],
      [{XG: "N 100"}, e.format],
      [{XG: "N100"}, false],
      [{XG: "N999"}, false]
    ]
  ],
  [
    "DU", [
      [{DU: "2"}, e.format],
      [{DU: 0}, e.format],
      [{DU: 1}, false],
      [{DU: 2000}, false]
    ]
  ],
  [
    "CA", [
      [{CA: "POR"}, e.format],
      [{CA: "200"}, e.format],
      [{CA: 200}, e.format],
      [{CA: "LKA 2000"}, false],
      [{CA: "PKS 200 ASK 10 KOP 5313"}, false]
    ]
  ],
  [
    "ME", [
      [{ME: "2"}, e.format],
      [{ME: -1}, e.format],
      [{ME: 2}, false],
      [{ME: 10}, false]
    ]
  ],
  [
    "GS", [
      [{GS: "2"}, e.format],
      [{GS: 0}, e.format],
      [{GS: 1}, false],
      [{GS: 4}, false]
    ]
  ],
  [
    "LS", [
      [{LS: ""}, e.format],
      [{LS: 0}, e.format],
      [{LS: "PNA"}, false],
      [{LS: "KNFEA"}, false]
    ]
  ],
  [
    "KG", [
      [{KG: "POR"}, e.format],
      [{KG: "200"}, e.format],
      [{KG: 200}, e.format],
      [{KG: "LKA 2000"}, false],
      [{KG: "PKS 200 ASK 10 KOP 5313"}, false]
    ]
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