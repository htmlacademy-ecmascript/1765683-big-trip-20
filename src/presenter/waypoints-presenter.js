import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EventNewView from '../view/event-new-view.js';
import EmptyListMessage from '../view/event-list-empty-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';
import { updateItem, sortPointByPrice, sortPointByTime, getRandomArrayElement } from '../mock/util.js';
import SortView from '../view/sort-view.js';
import { SORT_TYPE } from '../mock/const.js';

export default class WaypointPresenter {
  #eventContainer = null;
  #waypointsModel = null;
  #waypoints = [];
  #sourcedWaypoints = [];
  #eventListComponent = new EventListView();
  #newEventComponent = null;
  #waypointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SORT_TYPE.default;

  constructor({ eventContainer, waypointsModel }) {
    this.#eventContainer = eventContainer;
    this.#waypointsModel = waypointsModel;
  }

  init() {
    this.#waypoints = [...this.#waypointsModel.waypoints];

    this.#sourcedWaypoints = [...this.#waypointsModel.waypoints];

    this.#renderSort();
    this.#renderEventList();
    this.#renderPage();
  }

  #renderPage() {
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

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#eventContainer);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortWaypoints(sortType);
    this.#clearWaypointList();
    this.#renderPage();
  };

  #renderEventList() {
    render(this.#eventListComponent, this.#eventContainer);
  }

  #renderNewEventComponent() {
    this.newEventComponent = new EventNewView({waypoints: getRandomArrayElement(this.#waypoints)});
    render(this.newEventComponent, this.#eventListComponent.element);
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

  #sortWaypoints(sortType) {
    switch (sortType) {
      case SORT_TYPE.time:
        this.#waypoints = [...sortPointByTime(this.#waypoints)];
        break;
      case SORT_TYPE.price:
        this.#waypoints = [...sortPointByPrice(this.#waypoints)];
        break;
      default:
        this.#waypoints = [...this.#sourcedWaypoints];
    }

    this.#currentSortType = sortType;
  }

  #clearWaypointList() {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
  }

  #handleWaypointChange = (updatedWaypoint) => {
    this.#waypoints = updateItem(this.#waypoints, updatedWaypoint);
    this.#sourcedWaypoints = updateItem(
      this.#sourcedWaypoints,
      updatedWaypoint
    );
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint);
  };

  #renderEmptyListMessage() {
    render(new EmptyListMessage(), this.#eventListComponent.element);
  }
}
