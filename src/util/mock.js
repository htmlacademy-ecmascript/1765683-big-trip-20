import {
  TRAVEL_WAYPOINTS,

} from './const.js';
import { getRandomNumber } from './util.js';
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
