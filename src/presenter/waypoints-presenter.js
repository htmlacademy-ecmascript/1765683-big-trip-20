import { remove, render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EmptyListMessage from '../view/event-list-empty-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';
import { sortPointByPrice, sortPointByTime } from '../mock/waypoints.js';
import SortView from '../view/sort-view.js';
import { SortType, UpdateType, UserAction } from '../mock/const.js';


export default class WaypointsPresenter {
  #waypointsContainer = null;
  #waypointsModel = null;

  #eventListComponent = new EventListView();
  #waypointPresenters = new Map();
  #sortComponent = null;
  #NoWaypointComponent = null;
  #currentSortType = SortType.DEFAULT;

  constructor({ waypointsContainer, waypointsModel }) {
    this.#waypointsContainer = waypointsContainer;
    this.#waypointsModel = waypointsModel;

    this.#waypointsModel.addObservable(this.#handleModelEvent);
  }

  get waypoints() {

    switch (this.#currentSortType) {
      case SortType.TIME:
        return this.#waypointsModel.waypoints.sort(sortPointByTime);
      case SortType.PRICE:
        return this.#waypointsModel.waypoints.sort(sortPointByPrice);
      default:
        return [...this.#waypointsModel.waypoints];
    }
  }

  init() {

    this.#renderPage();
  }


  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this.#waypointsModel.ADD_WAYPOINT(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointsModel.DELETE_WAYPOINT(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#waypointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPage();
        this.#renderPage();
        break;
      case UpdateType.MAJOR:
        this.#clearPage({resetSortType: true});
        this.#renderPage();
        break;
    }
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPage();
    this.#renderWaypointsList();
  };


  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#waypointsContainer);
  }

  #renderWaypoint(waypoint) {
    const singleWaypointPresenter = new SingleWaypointPresenter({
      eventListComponent: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    singleWaypointPresenter.init(waypoint);
    this.#waypointPresenters.set(waypoint.id, singleWaypointPresenter);
  }

  #renderWaypoints(waypoints) {
    waypoints.forEach((waypoint) => this.#renderWaypoint(waypoint));
  }

  #renderNoWaypoints() {
    this.#NoWaypointComponent = new EmptyListMessage();
    render(this.#NoWaypointComponent, this.#eventListComponent.element);
  }

  #clearPage({resetSortType = false} = {}) {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#NoWaypointComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderWaypointsList() {
    render(this.#eventListComponent, this.#waypointsContainer);

    this.#renderWaypoints();
  }

  #renderPage() {
    const waypoints = this.waypoints;

    if (!waypoints.length) {
      this.#renderNoWaypoints();
      return;
    }

    this.#renderSort();
    this.#renderWaypointsList();
  }
}
