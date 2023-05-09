import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventNewView from '../view/event-new-view.js';
import EventView from '../view/event-view.js';
import { getRandomArrayElement } from '../util.js';

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

    render(this.#eventListComponent, this.#eventContainer);
    render(new EventEditView({waypoint: getRandomArrayElement(this.#waypoints)}), this.#eventListComponent.element);
    render(this.#newEventComponent, this.#eventListComponent.element);

    for (let i = 0; i < this.#waypoints.length; i++) {
      render(
        new EventView({ waypoint: this.#waypoints[i] }),
        this.#eventListComponent.element
      );
    }
  }
}
