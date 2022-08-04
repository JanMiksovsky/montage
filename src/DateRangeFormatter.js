const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Formats two dates into a human-friendly range.
 */
export default class DateRangeFormatter {
  /**
   * Given a single date, return a friendly representation of the date
   * that matches the formats returned by formatRange.
   *
   * @param {Date} date
   */
  static formatDate(date) {
    const { month, year } = this.#getDateParts(date);
    return `${month} ${year}`;
  }

  /**
   * Given two dates, summarize the time span covered by them.
   *
   * The goal is to natural and express date ranges the way a person would. The
   * result should always be accurate, but not necessarily precise; the expressed
   * range may be larger than the actual range.
   *
   * @param {Date} date1
   * @param {Date} date2
   */
  static formatRange(date1, date2) {
    // Break things apart.
    const { months, years } = this.#getDateDifference(date1, date2);
    const { month: month1, year: year1 } = this.#getDateParts(date1);
    const { month: month2, year: year2 } = this.#getDateParts(date2);
    // Pick an appropriate format string for the range.
    if (years === 1 && months <= 6) {
      // Different year, but still within half a year of each other.
      return `${month1} ${year1}&thinsp;&ndash;&thinsp;${month2} ${year2}`;
    } else if (years > 0) {
      // Different year
      return `${year1}&ndash;${year2}`;
    } else if (months > 6) {
      // Same year, more than half year apart.
      return `${year1}`;
    } else if (1 < months) {
      // and months <= 6
      // Same year, less than half year of each other, but not adjacent months.
      return `${month1}&thinsp;&ndash;&thinsp;${month2} ${year1}`;
    } else {
      // Same year, same month, more than half month apart
      // else if months == 1 and days <= 15
      //   # Same year, adjacent months, dates within half month of each other.
      //   "#{month1} #{day1}&thinsp;&ndash;&thinsp;#{month2} #{day2}, #{year1}"
      // else if months == 1
      //   # Same year, adjacent months, dates more than half month apart.
      //   "#{month1}/#{month2} #{year1}"
      return `${month1} ${year1}`;
    }
    // else if days > 0
    //   # Same year, same month, half month or less apart, different day
    //   "#{month1} #{day1}&thinsp;&ndash;&thinsp;#{day2}, #{year1}"
    // else
    //   # Same day.
    //   "#{month1} #{day1}, #{year1}"
  }

  static #getDateParts(date) {
    return {
      year: date.getFullYear(),
      month: monthNames[date.getMonth()],
      day: date.getDate(),
    };
  }

  /**
   * Given two dates, return the number of days, months, and years between them.
   * This throws an exception if the second date comes before the first.
   *
   * @param {Date} date1
   * @param {Date} date2
   */
  static #getDateDifference(date1, date2) {
    const time1 = date1.getTime();
    const time2 = date2.getTime();
    if (time1 > time2) {
      throw "DateRangeFormatter: the first date must be on or before second date.";
    }
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    let days = (time2 - time1) / millisecondsInDay;
    if (days < 1 && date1.getDate() !== date2.getDate()) {
      // Less than 24 hours apart, but on different dates: could as a day apart.
      days = 1;
    } else {
      days = Math.floor(days);
    }
    const years = date2.getFullYear() - date1.getFullYear();
    const months = years * 12 + date2.getMonth() - date1.getMonth();
    return { days, months, years };
  }
}
