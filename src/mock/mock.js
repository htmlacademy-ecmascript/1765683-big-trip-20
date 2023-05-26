import { WAYPOINT_OPTIONS, TRAVEL_WAYPOINTS, TOTAL_PRICE, OFFERS, OFFERS_PRICE, DATE_FROM, DATE_TO } from './const.js';
import { getRandomNumber, getRandomArrayElement } from './util.js';
import { nanoid } from 'nanoid';

export const mapWaypoints = new Map();
const mapOptions = new Map();

TRAVEL_WAYPOINTS.forEach((elem) => {
  mapWaypoints.set(elem, {
    'id': nanoid(),
    'description': `some description template of  ${elem}`,
    'name': elem,
    'pictures': Array.from({ length: getRandomNumber() }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
      description: `${elem} parliament building`,
    })),
  });
});

WAYPOINT_OPTIONS.forEach((elem) => {
  mapOptions.set(elem,
    [
      {
        'id': nanoid(),
        'title': getRandomArrayElement(OFFERS),
        'price': getRandomArrayElement(OFFERS_PRICE)
      }
    ],

  );

});

export const getRandomData = () => {
  const type = getRandomArrayElement(WAYPOINT_OPTIONS);
  return {
    'id': nanoid(),
    'basePrice': getRandomArrayElement(TOTAL_PRICE),
    'dateFrom': getRandomArrayElement(DATE_FROM),
    'dateTo': getRandomArrayElement(DATE_TO),
    'destination': mapWaypoints.get(getRandomArrayElement(TRAVEL_WAYPOINTS)),
    'isFavorite': [true,false][Math.floor(Math.random() * 2)],
    'offers': mapOptions.get(type),
    'type': type,
  };

};
