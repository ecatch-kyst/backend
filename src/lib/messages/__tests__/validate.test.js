import { validateMessage } from "../utils"


const validResponse = {RS: "ACK"}

const invalidResponse = {RS: "NAK"}

const malformedResponse = {
  ...invalidResponse,
  // ... etc
}
// TODO: Add possible responses


describe("Dualog validation", () => {

  describe("DEP", () => {
    it("should be valid", () => {
      expect(validateMessage({
        //TODO: Add a valid message here
      })).toEqual(validResponse)
    })
    // TODO: Add tests with valid/invalid values for DEP
  })
  // TODO: Add tests with valid/invalid values for other message types

  // TODO: Add tests with invalid types

})