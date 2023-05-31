import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EmptyListMessage from '../view/event-list-empty-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';
import { updateItem, sortPointByPrice, sortPointByTime } from '../mock/waypoints.js';
import SortView from '../view/sort-view.js';
import { SortType } from '../mock/const.js';

export default class WaypointPresenter {
  #waypointsContainer = null;
  #waypointsModel = null;

  #waypoints = [];
  #sourcedWaypoints = [];
  #eventListComponent = new EventListView();
  #waypointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DEFAULT;

  constructor({ waypointsContainer, waypointsModel }) {
    this.#waypointsContainer = waypointsContainer;
    this.#waypointsModel = waypointsModel;
  }

  init() {
    this.#waypoints = [...this.#waypointsModel.waypoints];
    this.#sourcedWaypoints = [...this.#waypointsModel.waypoints];


    this.#renderPage();
  }


  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleWaypointChange = (updatedWaypoint) => {
    this.#waypoints = updateItem(this.#waypoints, updatedWaypoint);
    this.#sourcedWaypoints = updateItem(
      this.#sourcedWaypoints,
      updatedWaypoint
    );
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint);
  };

  #sortWaypoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#waypoints = this.#waypoints.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        this.#waypoints = this.#waypoints.sort(sortPointByPrice);
        break;
      default:
        this.#waypoints = [...this.#sourcedWaypoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortWaypoints(sortType);
    this.#clearWaypointsList();
    this.#renderWaypointsList();
  };


  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#waypointsContainer);
  }

  #renderWaypoint(waypoint) {
    const singleWaypointPresenter = new SingleWaypointPresenter({
      eventListComponent: this.#eventListComponent.element,
      onDataChange: this.#handleWaypointChange,
      onModeChange: this.#handleModeChange,
    });
    singleWaypointPresenter.init(waypoint);
    this.#waypointPresenters.set(waypoint.id, singleWaypointPresenter);
  }

  #renderWaypoints() {
    this.#waypoints.forEach((waypoint) => this.#renderWaypoint(waypoint));
  }

  #renderNoWaypoints() {
    render(new EmptyListMessage(), this.#eventListComponent.element);
  }

  #clearWaypointsList() {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
  }

  #renderWaypointsList() {
    render(this.#eventListComponent, this.#waypointsContainer);

    this.#renderWaypoints();
  }

  #renderPage() {
    if (!this.#waypoints.length) {
      this.#renderNoWaypoints();
      return;
    }

    this.#renderSort()
    this.#renderWaypointsList();
  }
}
