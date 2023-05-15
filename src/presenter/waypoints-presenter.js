import { render, replace } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventNewView from '../view/event-new-view.js';
import EventView from '../view/event-view.js';
import { getRandomArrayElement } from '../util.js';
import EmptyListMessage from '../view/event-list-empty-view.js';

export default class WaypointPresenter {
  #eventContainer = null;
  #waypointsModel = null;
  #waypoints = [];
  #eventListComponent = new EventListView();
  #newEventComponent = new EventNewView();

  constructor({ eventContainer, waypointsModel }) {
    this.#eventContainer = eventContainer;
    this.#waypointsModel = waypointsModel;
  }

  init() {
    this.#waypoints = [...this.#waypointsModel.waypoints];

    this.#renderEventList();

    if (this.#waypoints.length !== 0) {

      this.#renderNewEventComponent();

      for (let i = 0; i < this.#waypoints.length; i++) {
        this.#renderWaypoints(this.#waypoints[i]);
      }
    } else {
      this.#renderEmptyListMessage();
    }

  }

  #renderEventList() {
    render(this.#eventListComponent, this.#eventContainer);
  }

  #renderNewEventComponent() {
    render(this.#newEventComponent, this.#eventListComponent.element);
  }

  #renderWaypoints(waypoint) {

    const escKeydownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditToInfo();
        document.removeEventListener('keydown', escKeydownHandler);
      }
    };


    const eventViewComponent = new EventView({
      waypoint,
      onEditClick: () => {
        replaceInfoToEdit();
        document.addEventListener('keydown', escKeydownHandler);
      }
    });

    const eventEditComponent = new EventEditView({ waypoint: getRandomArrayElement(this.#waypoints),
      onFormSubmit: () => {
        replaceEditToInfo();
        document.removeEventListener('keydown', escKeydownHandler);
      },
      onFormCancel: () => {
        replaceEditToInfo();
        document.removeEventListener('keydown', escKeydownHandler);
      }});


    function replaceInfoToEdit() {
      replace(eventEditComponent, eventViewComponent);
    }

    function replaceEditToInfo() {
      replace(eventViewComponent, eventEditComponent);
    }

    render(eventViewComponent, this.#eventListComponent.element);
  }


  #renderEmptyListMessage() {
    render(new EmptyListMessage, this.#eventListComponent.element);
  }
}
