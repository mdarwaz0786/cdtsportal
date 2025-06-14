const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getMonthName(monthNumber) {
  if (monthNumber === "") {
    return;
  };

  const index = parseInt(monthNumber, 10) - 1;
  return months[index] || "Invalid Month";
};

export default getMonthName;