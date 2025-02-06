export const formatDate = (date) => {
  const pad = (num) => (num < 10 ? "0" + num : num);
  const utcOffset = 7 * 60 * 60 * 1000;
  const offsetTime = new Date(date.getTime() + utcOffset);
  const day = pad(offsetTime.getUTCDate());
  const month = pad(offsetTime.getUTCMonth() + 1);
  const year = offsetTime.getUTCFullYear();
  const hours = pad(offsetTime.getUTCHours());
  const minutes = pad(offsetTime.getUTCMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatResponse = (status, data) => {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export function parseDateTime(input) {
  // Split the date and time components
  const [datePart, timePart] = input.split("T");

  // Extract year, month, and day
  const [year, month, day] = datePart.split("-");

  // Extract hours and minutes
  const [hours, min] = timePart.split(":");

  // Create the resulting object
  const result = {
    date: {
      hours: hours,
      min: min,
      day: day,
      month: month,
      year: year,
    },
  };

  return result;
}

export const getCurrentTime = () => {
  // Get Thailand time by adding 7 hours to UTC

  const thailandTime = new Date();

  // Format to "YYYY-MM-DDTHH:mm"
  const year = thailandTime.getFullYear();
  const month = String(thailandTime.getMonth() + 1).padStart(2, "0");
  const day = String(thailandTime.getDate()).padStart(2, "0");
  const hours = String(thailandTime.getHours()).padStart(2, "0");
  const minutes = String(thailandTime.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
