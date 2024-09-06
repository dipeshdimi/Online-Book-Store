function parseDate(dateString) {
  if (!dateString || typeof dateString !== "string") {
    return null;
  }

  const [day, monthName, year] = dateString.split(" ");

  if (isNaN(day) || !monthName || isNaN(year)) {
    return null;
  }

  const monthIndex = new Date(Date.parse(monthName + " 1")).getMonth();
  return new Date(year, monthIndex, day);
}

module.exports = {
  parseDate,
};
