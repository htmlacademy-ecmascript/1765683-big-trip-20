import WaypointsPresenter from './presenter/waypoints-presenter.js';
import WaypointsModel from './model/waypoints-model.js';
import { generateFilter } from './mock/filter.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import FilterModel from './model/filter-model.js';

const waypointsContainer = document.querySelector('main .trip-events');
const filtersContainer = document.querySelector('header .trip-controls__filters');


const waypointsModel = new WaypointsModel();
const filterModel = new FilterModel();

const filters = generateFilter(waypointsModel.waypoints);
const filtersPresenter = new FiltersPresenter({ filtersContainer });


const waypointsPresenter = new WaypointsPresenter({waypointsContainer, waypointsModel });


waypointsPresenter.init();
filtersPresenter.init(filters);
