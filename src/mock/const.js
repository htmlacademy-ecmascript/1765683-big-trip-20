const TRAVEL_WAYPOINTS = [
  'Amsterdam',
  'Chamonix',
  'Geneva',
  'New York',
  'Moscow',
  'Tokyo',
];

const WAYPOINT_OPTIONS = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const OFFERS = [
  'Upgrade to a business class',
  'Add luggage',
  'Switch to comfort',
  'Rent a car',
  'Order Uber',
  'Add breakfast',
];

const OFFERS_PRICE = [20, 50, 140, 200, 600];

const TOTAL_PRICE = [20, 160, 600, 830];

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SORT_TYPE = {
  default: 'day',
  event: 'event',
  time: 'time',
  price: 'price',
  offers: 'offers',
};

const LABEL = 'LABEL';

const DATE_FROM = [
  '2019-07-10T22:55:56.845Z',
  '2019-07-10T21:30:56.845Z',
  '2019-07-10T19:15:56.845Z',
  '2019-07-10T12:10:31.845Z',
];

const DATE_TO = [
  '2019-07-11T12:10:13.375Z',
  '2019-07-11T13:05:07.375Z',
  '2019-07-11T10:33:13.375Z',
  '2019-07-11T14:44:22.375Z',
];

export {
  TRAVEL_WAYPOINTS,
  WAYPOINT_OPTIONS,
  TOTAL_PRICE,
  OFFERS,
  OFFERS_PRICE,
  Mode,
  SORT_TYPE,
  LABEL,
  DATE_FROM,
  DATE_TO,
};
