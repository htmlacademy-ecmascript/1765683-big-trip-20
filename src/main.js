import WaypointsPresenter from './presenter/waypoints-presenter.js';
import WaypointsModel from './model/waypoints-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import FilterModel from './model/filter-model.js';
import NewEventButtonView from './view/new-event-btn-view.js';
import { render } from './framework/render.js';

const waypointsContainer = document.querySelector('main .trip-events');
const filtersContainer = document.querySelector(
  'header .trip-controls__filters'
);
const newEventButtonContainer = document.querySelector('.trip-main');

const waypointsModel = new WaypointsModel();
const filterModel = new FilterModel();

const filtersPresenter = new FiltersPresenter({
  filtersContainer,
  waypointsModel,
  filterModel,
});

const waypointsPresenter = new WaypointsPresenter({
  waypointsContainer,
  waypointsModel,
  filterModel,
  onNewWaypointDestroy: handleNewEventFormClose
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewEventButtonClick,
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventButtonClick() {
  waypointsPresenter.createWaypoint();
  newEventButtonComponent.element.disabled = true;
}

render(newEventButtonComponent, newEventButtonContainer);

waypointsPresenter.init();
filtersPresenter.init();
