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
  return items.map((item) => item.id === update.id ? update : item);
}

function durationPoint(point) {
  return dayjs(point.dateTo).diff(dayjs(point.dateFrom));
}

function sortPointByTime(points) {
  return points.sort((a, b) => durationPoint(b) - durationPoint(a));
}

function sortPointByPrice(points) {
  return points.sort((a, b) => b.basePrice - a.basePrice);
}

export { getRandomNumber, getRandomArrayElement, humanizeDate, updateItem, sortPointByPrice, sortPointByTime };
