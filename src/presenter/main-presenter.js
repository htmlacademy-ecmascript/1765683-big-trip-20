import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import { render } from '../framework/render.js';

export default class MainPresenter {
  #sortComponent = new SortView();
  #filterComponent = new FilterView();
  #eventContainer = null;
  #siteFiltersElement;

  constructor({eventContainer, siteFiltersElement}){
    this.#eventContainer = eventContainer;
    this.#siteFiltersElement = siteFiltersElement;
  }

  init(){

    this.#renderSortComponent();
    this.#renderFilterComponent();

  }

  #renderSortComponent() {
    render(this.#sortComponent, this.#eventContainer);
  }

  #renderFilterComponent() {
    render(this.#filterComponent, this.#siteFiltersElement);
  }
}
