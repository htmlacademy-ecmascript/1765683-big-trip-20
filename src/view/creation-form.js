import { createElement } from '../render.js';

function createCreationFormTemplate() {
  return ;
}

export default class NewTaskButtonView {
  getTemplate() {
    return createCreationFormTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
