import { render, remove, RenderPosition } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import { nanoid } from 'nanoid';
import { UserAction, UpdateType } from '../mock/const.js';


export default class NewWaypointPresenter {
  #eventListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #eventEditComponent = null;

  constructor({ eventListContainer, onDataChange, onDestroy }) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEditView({
      onFormSubmit: this.#handleFormSubmit,
      onDelete: this.#handleDeleteClick,
      onCancel: this.#handleCancelClick
    });

    render(
      this.#eventEditComponent,
      this.#eventListContainer,
      RenderPosition.AFTERBEGIN
    );

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (waypoint) => {
    this.#handleDataChange(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      { waypoint }
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
