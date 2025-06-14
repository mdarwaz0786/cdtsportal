// Function to convert date from "YYYY-MM-DD" to "DD MMM YYYY"
const formatDate = (dateString) => {
  if (!dateString) return "";

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const [year, month, day] = dateString.split("-").map(Number);

  const monthName = months[month - 1];
  return `${day || ""} ${monthName || ""} ${year || ""}`;
};

export default formatDate;
