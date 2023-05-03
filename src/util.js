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

export { getRandomNumber, getRandomArrayElement, humanizeDate };
