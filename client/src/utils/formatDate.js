let options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false
};

function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
}

export default formatDate;
