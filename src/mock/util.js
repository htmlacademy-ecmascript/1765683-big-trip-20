import dayjs from 'dayjs';
const DATE_FORMAT = 'HH:mm';

function humanizeDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

function getRandomNumber() {
  Math.floor(Math.random() * 20);
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function updateItem(items, update) {
  return items.map((item) => (item.id === update.id ? update : item));
}

function durationWaypoint(waypoint) {
  return dayjs(waypoint.dateTo).diff(dayjs(waypoint.dateFrom));
}

function sortPointByTime(points) {
  return points.sort((a, b) => durationWaypoint(b) - durationWaypoint(a));
}

function sortPointByPrice(points) {
  return points.sort((a, b) => b.basePrice - a.basePrice);
}

const getDatesDiff = (dateFrom, dateTo, time) =>
  time ? dayjs(dateTo).diff(dayjs(dateFrom), time) : dayjs(dateTo).diff(dayjs(dateFrom));

const getDuration = (dateFrom, dateTo) => {
  const minutes = getDatesDiff(dateFrom, dateTo, 'minute');
  const hourDur = parseInt(minutes / 60, 10);
  const minuteDur = dayjs().minute(minutes).$m;
  return { hourDur, minuteDur };
};

export {
  getRandomNumber,
  getRandomArrayElement,
  humanizeDate,
  updateItem,
  sortPointByPrice,
  sortPointByTime,
  getDuration
};
