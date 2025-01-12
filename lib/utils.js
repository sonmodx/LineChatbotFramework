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
  return new Response(
    JSON.stringify(data),
    {
      status: status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
