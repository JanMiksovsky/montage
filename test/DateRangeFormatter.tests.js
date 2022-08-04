import DateRangeFormatter from "../src/DateRangeFormatter.js";
import assert from "./assert.js";

describe("DateRangeFormatter", () => {
  it("different year", function () {
    verifyDateRangeFormat("1/1/2006", "12/31/2007", "2006&ndash;2007");
  });

  // [ExpectedException(typeof(ArgumentException))]
  // test "dates in wrong order", ->
  //   verifyDateRangeFormat "12/31/2007", "1/1/2006", "2006&ndash;2007"
  it("different year, close months", function () {
    verifyDateRangeFormat(
      "10/1/2006",
      "3/30/2007",
      "October 2006&thinsp;&ndash;&thinsp;March 2007"
    );
  });
  it("same year", function () {
    verifyDateRangeFormat("1/1/2007", "12/31/2007", "2007");
  });
  it("same year, close months", function () {
    verifyDateRangeFormat(
      "1/1/2007",
      "6/30/2007",
      "January&thinsp;&ndash;&thinsp;June 2007"
    );
  });
  // test "same year, adjacent months", ->
  //   verifyDateRangeFormat "1/1/2007", "2/1/2007", "January/February 2007"

  // test "same year, adjacent months, close dates", ->
  //   verifyDateRangeFormat "1/28/2007", "2/11/2007", "January 28&thinsp;&ndash;&thinsp;February 11, 2007"
  return it("same month", function () {
    verifyDateRangeFormat("1/1/2007", "1/31/2007", "January 2007");
  });

  // test "same month, close dates", ->
  //   verifyDateRangeFormat "1/1/2007", "1/15/2007", "January 1&ndash;15, 2007"

  // test "same day", ->
  //   verifyDateRangeFormat "1/1/2007", "1/1/2007", "January 1, 2007"
});

function verifyDateRangeFormat(dateString1, dateString2, expected) {
  const date1 = new Date(Date.parse(dateString1));
  const date2 = new Date(Date.parse(dateString2));
  const result = DateRangeFormatter.formatRange(date1, date2);
  assert.equal(result, expected);
}
