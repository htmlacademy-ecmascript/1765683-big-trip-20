import { render } from '../framework/render.js';

export default class FiltersPresenter {
  #filterComponent = null;
  #filterElement = null;

  constructor({ filterComponent, filterElement }) {
    this.#filterComponent = filterComponent;
    this.#filterElement = filterElement;
  }

  init() {
    render(this.#filterComponent, this.#filterElement);
  }
}
