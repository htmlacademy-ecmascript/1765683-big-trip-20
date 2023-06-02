import {
  TRAVEL_WAYPOINTS,
  OFFERS,
  DATE_FROM,
  DATE_TO,
  WAYPOINT_TYPES,
} from './const.js';
import { getRandomNumber, getRandomArrayElement } from './util.js';
import { nanoid } from 'nanoid';

const createDestination = (name) => ({
  id: nanoid(),
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  name,
  pictures: Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
    src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
    destination: 'Lorem ipsum dolor sit amet',
  })),
});

export const DESTINATIONS = TRAVEL_WAYPOINTS.map(createDestination);

const createOffer = () => ({
  id: nanoid(),
  title: getRandomArrayElement(OFFERS),
  price: Math.floor(Math.random() * 100),
});

export const getRandomData = () => ({
  id: nanoid(),
  basePrice: Math.floor(Math.random() * 1000),
  dateFrom: getRandomArrayElement(DATE_FROM),
  dateTo: getRandomArrayElement(DATE_TO),
  destination: getRandomArrayElement(DESTINATIONS),
  isFavorite: Math.random() * 2 > 1,
  offers: Array.from({ length: Math.floor(Math.random() * 3) })
    .fill('')
    .map(createOffer),
  type: getRandomArrayElement(WAYPOINT_TYPES),
});
