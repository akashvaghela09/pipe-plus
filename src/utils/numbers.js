export const formatNumbers = (views) => {
  // If views are less than 1000, no need to format
  if (views < 1000) {
    return views;
  } else if (views < 1000000) {
    // For views in thousands (1K to 999K)
    return (views / 1000).toFixed(1) + "K";
  } else {
    // For views in millions (1M and above)
    return (views / 1000000).toFixed(1) + "M";
  }
}

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.ceil(seconds % 60);

  let timeString = "";

  if (hours > 0) {
      timeString += hours + ":";
  }

  if (minutes > 0 || hours > 0) {
      timeString += (minutes < 10 && hours > 0 ? "0" : "") + minutes + ":";
  } else {
      timeString += "0:";
  }

  timeString += (remainingSeconds < 10 ? "0" : "") + remainingSeconds;

  return timeString;
}

export function formatDate(input) {
  const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const parts = input.split('-');
  if (parts.length !== 3) {
      throw new Error('Invalid input format');
  }

  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1; // because months are 0-indexed in JavaScript
  const day = parts[2];

  if (monthIndex < 0 || monthIndex > 11) {
      throw new Error('Invalid month');
  }

  return {
      year: parseInt(year, 10),
      date: `${day} ${months[monthIndex]}`
  };
}

export function formatIndianNumbering(number) {
  if (typeof number !== 'number') {
      return "Invalid input";
  }

  let numStr = number.toString();
  // If number is less than 1000, return it as is
  if (numStr.length <= 3) {
      return numStr;
  }

  // For the last 3 digits
  let lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
  }

  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
}

export function formatReadableDate(inputDate) {
  const date = new Date(inputDate);
  const now = new Date();

  // Calculate the time difference in milliseconds
  const diffMilliseconds = now - date;
  const diffSeconds = diffMilliseconds / 1000;
  const diffMinutes = diffSeconds / 60;
  const diffHours = diffMinutes / 60;
  const diffDays = diffHours / 24;

  if (diffMinutes < 60) {
      return `${Math.floor(diffMinutes)} minutes ago`;
  }

  if (diffHours < 24) {
      return `${Math.floor(diffHours)} hours ago`;
  }

  if (diffDays === 1) {
      return 'Yesterday';
  }

  if (diffDays < 30) {
      return `${Math.floor(diffDays)} days ago`;
  }

  const diffMonths = diffDays / 30;
  if (diffMonths < 12) {
      return `${Math.floor(diffMonths)} month${Math.floor(diffMonths) > 1 ? 's' : ''} ago`;
  }

  const diffYears = diffMonths / 12;
  return `${Math.floor(diffYears)} year${Math.floor(diffYears) > 1 ? 's' : ''} ago`;
}