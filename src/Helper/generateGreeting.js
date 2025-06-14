// Function to get greeting based on the current hour
const getGreeting = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  const currentHour = istDate.getUTCHours();

  if (currentHour >= 6 && currentHour < 12) {
    return "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good Afternoon";
  } else if (currentHour >= 18 && currentHour < 22) {
    return "Good Evening";
  } else {
    return "Good Night";
  };
};

export default getGreeting;
