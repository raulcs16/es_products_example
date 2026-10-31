import { testing_units } from "./testing";

describe("TESTING JEST CONFIG", () => {
  test("", () => {
    const assumption = 8;
    const actual = testing_units(4, 2);
    const assertion = assumption === actual;

    expect(assertion).toEqual(true);
  });
});
