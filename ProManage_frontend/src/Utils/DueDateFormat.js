const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric" };

  // Format the date as "June 20"
  let formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // Get the day of the month
  const day = date.getDate();

  // Add suffix to the day
  let dayWithSuffix;
  if (day === 1 || day === 21 || day === 31) {
    dayWithSuffix = `${day}st`;
  } else if (day === 2 || day === 22) {
    dayWithSuffix = `${day}nd`;
  } else if (day === 3 || day === 23) {
    dayWithSuffix = `${day}rd`;
  } else {
    dayWithSuffix = `${day}th`;
  }

  // Replace the numeric day with the day with suffix
  formattedDate = formattedDate.replace(day, dayWithSuffix);

  return formattedDate;
};

export default formatDate;
