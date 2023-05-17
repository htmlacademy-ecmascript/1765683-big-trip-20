import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EventNewView from '../view/event-new-view.js';
import EmptyListMessage from '../view/event-list-empty-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';

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
    const singleWaypointPresenter = new SingleWaypointPresenter({eventListComponent: this.#eventListComponent.element
    });
    singleWaypointPresenter.init(waypoint);

  }


  #renderEmptyListMessage() {
    render(new EmptyListMessage, this.#eventListComponent.element);
  }
}
