import WaypointsPresenter from './presenter/waypoints-presenter.js';
import WaypointsModel from './model/waypoints-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import FilterModel from './model/filter-model.js';

const waypointsContainer = document.querySelector('main .trip-events');
const filtersContainer = document.querySelector('header .trip-controls__filters');


const waypointsModel = new WaypointsModel();
const filterModel = new FilterModel();

const filtersPresenter = new FiltersPresenter({ filtersContainer, waypointsModel, filterModel });


const waypointsPresenter = new WaypointsPresenter({waypointsContainer, waypointsModel, filterModel });


waypointsPresenter.init();
filtersPresenter.init();
