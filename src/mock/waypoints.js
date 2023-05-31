import { durationPoint } from './util';

export function updateItem(items, update) {
  return items.map((item) => (item.id === update.id ? update : item));
}

export function sortPointByTime(a, b) {
  return durationPoint(b) - durationPoint(a);
}

export function sortPointByPrice(a, b) {
  return b.basePrice - a.basePrice;
}
