import { WAYPOINT_OPTIONS, TRAVEL_WAYPOINTS, TOTAL_PRICE, OFFERS, OFFERS_PRICE } from '../const.js';
import { getRandomNumber, getRandomArrayElement } from '../util.js';


const mapWaypoints = new Map();
const mapOptions = new Map();

TRAVEL_WAYPOINTS.forEach((elem) => {
  mapWaypoints.set(elem, {
    'id': 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
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
        'id': 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        'title': getRandomArrayElement(OFFERS),
        'price': getRandomArrayElement(OFFERS_PRICE)
      }
    ],

  );

});

export const getRandomData = () => {
  const type = getRandomArrayElement(WAYPOINT_OPTIONS);
  return {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    'basePrice': getRandomArrayElement(TOTAL_PRICE),
    'dateFrom': '2019-07-10T22:55:56.845Z',
    'dateTo': '2019-07-11T11:22:13.375Z',
    'destination': mapWaypoints.get(getRandomArrayElement(TRAVEL_WAYPOINTS)),
    'isFavorite': [true,false][Math.floor(Math.random() * 2)],
    'offers': mapOptions.get(type),
    'type': type,
  };

};
