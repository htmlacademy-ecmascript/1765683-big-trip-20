import FilterView from '../view/filter-view.js';
import FiltersPresenter from './filters-presenter.js';


export default class MainPresenter {
  #filterComponent = new FilterView();
  #eventContainer = null;
  #siteFiltersElement;

  constructor({ eventContainer, siteFiltersElement }) {
    this.#eventContainer = eventContainer;
    this.#siteFiltersElement = siteFiltersElement;
  }

  init() {
    this.#renderFilterComponent();
  }

  #renderFilterComponent() {
    const filtersPresenter = new FiltersPresenter({
      filterComponent: this.#filterComponent,
      filterElement: this.#siteFiltersElement,
    });
    filtersPresenter.init();
  }
}
