// Get attendance data in Indian Standard Time (IST)
const getAttendanceData = (team) => {
  if (!team || !team?._id) {
    return { time: null, date: null, employeeId: null };
  };

  const now = new Date();

  const istDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const istTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);

  const employeeId = team?._id;

  return { time: istTime, date: istDate, employeeId };
};

export default getAttendanceData;
