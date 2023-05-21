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

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

export { getRandomNumber, getRandomArrayElement, humanizeDate, updateItem, getWeightForNullDate };
