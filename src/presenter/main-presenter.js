import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import { render } from '../render.js';

const siteHeaderElement = document.querySelector('header');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
export default class MainPresenter {
  sortComponent = new SortView();
  filterComponent = new FilterView();

  constructor({eventContainer}){
    this.eventContainer = eventContainer;
  }

  init(){

    render(this.sortComponent, this.eventContainer);
    render(this.filterComponent, siteFiltersElement);

  }
}
