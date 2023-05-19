import { render, remove } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EventNewView from '../view/event-new-view.js';
import EmptyListMessage from '../view/event-list-empty-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';
import { updateItem } from '../util.js';

export default class WaypointPresenter {
  #eventContainer = null;
  #waypointsModel = null;
  #waypoints = [];
  #eventListComponent = new EventListView();
  #newEventComponent = new EventNewView();
  #waypointPresenters = new Map();

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

  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEventList() {
    render(this.#eventListComponent, this.#eventContainer);
  }

  #renderNewEventComponent() {
    render(this.#newEventComponent, this.#eventListComponent.element);
  }

  #renderWaypoints(waypoint) {
    const singleWaypointPresenter = new SingleWaypointPresenter({
      eventListComponent: this.#eventListComponent.element,
      onDataChange: this.#handleWaypointChange,
      onModeChange: this.#handleModeChange,
    });
    singleWaypointPresenter.init(waypoint);
    this.#waypointPresenters.set(waypoint.id, singleWaypointPresenter);
  }

  #clearWaypointList() {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
    remove(this.this.#eventListComponent);
  }

  #handleWaypointChange = (updatedWaypoint) => {
    this.#waypoints = updateItem(this.#waypoints, updatedWaypoint);
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint);
  };

  #renderEmptyListMessage() {
    render(new EmptyListMessage(), this.#eventListComponent.element);
  }
}
