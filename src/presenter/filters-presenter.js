import { render } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
export default class FiltersPresenter {
  #filtersContainer = null;

  constructor({ filtersContainer }) {
    this.#filtersContainer = filtersContainer;
  }

  init(filters) {
    render(new FilterView({filters}), this.#filtersContainer);
  }
}
