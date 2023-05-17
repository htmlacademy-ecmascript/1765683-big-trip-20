import { render } from '../framework/render.js';

export default class SortPresenter {
  #sortComponent = null;
  #eventContainer = null;

  constructor({ sortComponent, eventContainer }) {
    this.#eventContainer = eventContainer;
    this.#sortComponent = sortComponent;
  }

  init() {
    render(this.#sortComponent, this.#eventContainer);
  }
}
