
import WaypointPresenter from './presenter/waypoints-presenter.js';
import WaypointsModel from './model/waypoints-model.js';

const waypointsContainer = document.querySelector('main .trip-events');
const filtersContainer = document.querySelector('header .trip-controls__filters');


const waypointsModel = new WaypointsModel();
const waypointsPresenter = new WaypointPresenter({waypointsContainer, waypointsModel });


waypointsPresenter.init();
