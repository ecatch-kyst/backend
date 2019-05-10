/**
 * Commented out fields should be handled better.
 * They are fields that are dependant on other fields.
 */

export const fields = {
  common: ["TM", "RN", "RC", "MA", "DA", "TI"],
  DEP: ["PO", "ZD", "ZT", "OB", "PD", "PT", "LA", "LO", "AC", "DS"],
  // NOTE: what is TS?
  DCA: [/*"MV",*/ "AD", "NA", "XR", "QI", "AC", /*"TS",*/ "BD","BT", "ZO", "LT", "LG", /*"GE",*/ "GP", "XT", "XG", "DU", /*"CA", "ME", "GS" These are dependent on GE,*/],
  POR: ["AD", "NA", "XR", "PO", "PD", "PT", "OB", "LS", "KG"]
}

export const VALIDTM = ["DEP", "DCA", "POR"]


// CA is dependent on AC === FIS