// Function to format time as hours minutes
const formatTimeToHoursMinutes = timeString => {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":").map(Number);

  if (hours === 0 && minutes === 0) {
    return null;
  };

  if (hours === 0) {
    return `${String(minutes).padStart(2, "0")} minutes`;
  };

  if (minutes === 0) {
    return `${String(hours).padStart(2, "0")} hours`;
  };

  return `${String(hours).padStart(2, "0")} hours ${String(minutes).padStart(2, "0")} minutes`;
};

export default formatTimeToHoursMinutes;
