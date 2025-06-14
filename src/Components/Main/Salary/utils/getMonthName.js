function getMonthName(monthNumber) {
  if (!monthNumber) return;
  const months = [
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

  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error("Invalid month number. Please provide a number between 1 and 12.");
  }

  return months[monthNumber - 1];
};

export default getMonthName;
