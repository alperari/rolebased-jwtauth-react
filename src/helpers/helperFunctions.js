export const parseDateTime = (date, type) => {
  // Example date: 2023-03-30T14:03:35.778+00:00

  const dateParts = date.split('T')[0];
  const timeParts = date.split('T')[1].split('.')[0];

  if (type == 'onlyDate') {
    return dateParts;
  }
  if (type == 'onlyTime') {
    return timeParts;
  } else {
    return [dateParts, timeParts];
  }
};
