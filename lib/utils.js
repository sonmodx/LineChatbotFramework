
export const formatDate = (date) => {
    // Helper function to pad numbers with leading zeros
    const pad = (num) => (num < 10 ? "0" + num : num);
    const utcOffset = 7 * 60 * 60 * 1000;
    const offsetTime = new Date(date.getTime() + utcOffset);
    // Extracting the individual components of the date
    const day = pad(offsetTime.getUTCDate());
    const month = pad(offsetTime.getUTCMonth() + 1); // Months are zero-indexed
    const year = offsetTime.getUTCFullYear();
    const hours = pad(offsetTime.getUTCHours());
    const minutes = pad(offsetTime.getUTCMinutes());
    // const seconds = pad(offsetTime.getUTCSeconds());
  
    // Formatting date to dd mm yyyy hh:mm:ss
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };