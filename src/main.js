import FilterView from './view/filter-view.js';
import MainPresenter from './presenter/main-presenter.js';
import { render } from './render.js';

const siteMainElement = document.querySelector('main');
const siteHeaderElement = document.querySelector('header');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEventsElement = siteMainElement.querySelector('.trip-events');
const mainPresenter = new MainPresenter({eventContainer: siteEventsElement});

render(new FilterView(), siteFiltersElement);

mainPresenter.init();
