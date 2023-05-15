import MainPresenter from './presenter/main-presenter.js';
import WaypointPresenter from './presenter/waypoints-presenter.js';
import WaypointsModel from './model/waypoints-model.js';

const siteMainElement = document.querySelector('main');
const siteEventsElement = siteMainElement.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('header');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const waypointsModel = new WaypointsModel();
const mainPresenter = new MainPresenter({eventContainer: siteEventsElement, siteFiltersElement});
const waypointPresenter = new WaypointPresenter({eventContainer: siteEventsElement, waypointsModel });

mainPresenter.init();
waypointPresenter.init();
