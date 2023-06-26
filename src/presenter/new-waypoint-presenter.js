import { render, remove, RenderPosition } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import { UserAction, UpdateType} from '../util/const.js';

export default class NewWaypointPresenter {
  #eventListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;


  #eventEditComponent = null;

  constructor({
    eventListContainer,
    onDataChange,
    onDestroy,
    waypointsModel,
  }) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.waypointsModel = waypointsModel;

  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEditView({
      offers: this.waypointsModel.offers,
      destinations: this.waypointsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDelete: this.#handleDeleteClick,
      onCancel: this.#handleCancelClick,
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

  setSaving() {
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (waypoint) => {
    this.#handleDataChange(UserAction.ADD_WAYPOINT, UpdateType.MINOR, waypoint);
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
