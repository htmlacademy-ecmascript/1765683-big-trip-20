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

const OFFERS = ['Upgrade to a business class', 'Add luggage', 'Switch to comfort', 'Rent a car', 'Order Uber', 'Add breakfast'];

const OFFERS_PRICE = [20, 50, 140, 200, 600, ];

const TOTAL_PRICE = [20, 160, 600, 830];

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SORT_TYPES = {
  day: 'day',
  event: 'event',
  time: 'time',
  price: 'price',
  offers: 'offers',
};

const LABEL = 'LABEL';

export { TRAVEL_WAYPOINTS, WAYPOINT_OPTIONS, TOTAL_PRICE, OFFERS, OFFERS_PRICE, Mode, SORT_TYPES, LABEL };
