// Function to format time to AM/PM
const formatTimeWithAmPm = timeString => {
  if (!timeString) return "";

  const [hour, minute] = timeString.split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${String(formattedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
};

export default formatTimeWithAmPm;
