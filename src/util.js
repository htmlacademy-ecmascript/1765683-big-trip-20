import dayjs from 'dayjs';

const humanizeDate = (anyDate, dateFormat) =>
  anyDate ? dayjs(anyDate).format(dateFormat) : '';

function getRandomNumber() {
  Math.floor(Math.random() * 20);
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export { getRandomNumber, getRandomArrayElement };
