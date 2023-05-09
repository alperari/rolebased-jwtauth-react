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

export const groupBy = (array, key) => {
  return array.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const get30DaysArray = () => {
  const dateArray = [];
  const today = new Date();
  const daysInMilliseconds = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today - i * daysInMilliseconds);
    const formattedDate = `${date.getFullYear().toString()}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    dateArray.push(formattedDate);
  }

  return dateArray;
};
