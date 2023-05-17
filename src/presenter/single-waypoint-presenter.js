import { render } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';
import { replace } from '../framework/render.js';
import { getRandomArrayElement } from '../util.js';

export default class SingleWaypointPresenter {
  #waypoint = null;
  #eventViewComponent = null;
  #eventListComponent = null;
  #eventEditComponent = null;

  constructor({ eventListComponent }) {
    this.#eventListComponent = eventListComponent;
  }

  init(waypoint) {
    this.#waypoint = waypoint;

    this.#eventViewComponent = new EventView({
      waypoint: this.#waypoint,
      onEditClick: this.#replaceEditHandler
    });

    this.#eventEditComponent = new EventEditView({
      waypoint: this.#waypoint,
      onFormSubmit: this.#replaceInfoHandler,
      onFormCancel: this.#replaceInfoHandler
    });

    render(this.#eventViewComponent, this.#eventListComponent);
  }

  #replaceInfoToEdit() {
    replace(this.#eventEditComponent, this.#eventViewComponent);
    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  #replaceEditToInfo() {
    replace(this.#eventViewComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeydownHandler);
  }

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditToInfo();
      document.removeEventListener('keydown', this.#escKeydownHandler);
    }
  };

  #replaceEditHandler = () => {
    this.#replaceInfoToEdit();
  };

  #replaceInfoHandler = () => {
    this.#replaceEditToInfo();
  };

}
