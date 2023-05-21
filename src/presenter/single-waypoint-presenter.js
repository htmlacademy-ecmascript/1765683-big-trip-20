import { render } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';
import { replace, remove } from '../framework/render.js';
import { Mode } from '../mock/const.js';

export default class SingleWaypointPresenter {
  #waypoint = null;
  #eventViewComponent = null;
  #eventListComponent = null;
  #eventEditComponent = null;
  #handleDataChange = null;
  #mode = Mode.DEFAULT;
  #handleModeChange = null;

  constructor({ eventListComponent, onDataChange, onModeChange }) {
    this.#eventListComponent = eventListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(waypoint) {
    this.#waypoint = waypoint;

    const prevEventComponent = this.#eventViewComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventViewComponent = new EventView({
      waypoint: this.#waypoint,
      onEditClick: this.#replaceEditHandler,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#eventEditComponent = new EventEditView({
      waypoint: this.#waypoint,
      onFormSubmit: this.#replaceInfoHandler,
      onFormCancel: this.#replaceInfoHandler,
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventViewComponent, this.#eventListComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventViewComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventViewComponent);
    remove(this.#eventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditToInfo();
    }
  }

  #replaceInfoToEdit() {
    replace(this.#eventEditComponent, this.#eventViewComponent);
    document.addEventListener('keydown', this.#escKeydownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditToInfo() {
    replace(this.#eventViewComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeydownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditToInfo();
      document.removeEventListener('keydown', this.#escKeydownHandler);
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#waypoint, isFavorite: !this.#waypoint.isFavorite});
  };

  #replaceEditHandler = () => {
    this.#replaceInfoToEdit();
  };

  #replaceInfoHandler = () => {
    this.#replaceEditToInfo();
  };
}
