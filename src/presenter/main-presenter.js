import SortPresenter from './sort-presenter.js';
import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import FiltersPresenter from './filters-presenter.js';


export default class MainPresenter {
  #sortComponent = new SortView();
  #filterComponent = new FilterView();
  #eventContainer = null;
  #siteFiltersElement;

  constructor({ eventContainer, siteFiltersElement }) {
    this.#eventContainer = eventContainer;
    this.#siteFiltersElement = siteFiltersElement;
  }

  init() {
    this.#renderSortComponent();
    this.#renderFilterComponent();
  }

  #renderSortComponent() {
    const sortPresenter = new SortPresenter({
      sortComponent: this.#sortComponent,
      eventContainer: this.#eventContainer,
    });
    sortPresenter.init();
  }

  #renderFilterComponent() {
    const filtersPresenter = new FiltersPresenter({
      filterComponent: this.#filterComponent,
      filterElement: this.#siteFiltersElement,
    });
    filtersPresenter.init();
  }
}
