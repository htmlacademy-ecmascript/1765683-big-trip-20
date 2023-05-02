import MainPresenter from './presenter/main-presenter.js';
import WaypointPresenter from './presenter/waypoints-presenter.js';
import WaypointsModel from './model/waypoints-model.js';

const siteMainElement = document.querySelector('main');
const siteEventsElement = siteMainElement.querySelector('.trip-events');
const mainPresenter = new MainPresenter({eventContainer: siteEventsElement});
const waypointsModel = new WaypointsModel();
const waypointPresenter = new WaypointPresenter({eventContainer: siteEventsElement, waypointsModel });

mainPresenter.init();
waypointPresenter.init();
