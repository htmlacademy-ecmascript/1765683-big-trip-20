import { durationPoint } from './util';

export function sortPointByTime(a, b) {
  return durationPoint(b) - durationPoint(a);
}

export function sortPointByPrice(a, b) {
  return b.basePrice - a.basePrice;
}
