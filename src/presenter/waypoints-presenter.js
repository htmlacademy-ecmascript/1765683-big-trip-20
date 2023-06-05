import { remove, render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EmptyListMessage from '../view/event-list-empty-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';
import { sortPointByPrice, sortPointByTime } from '../mock/waypoints.js';
import SortView from '../view/sort-view.js';
import { SortType, UpdateType, UserAction, FilterType } from '../mock/const.js';
import { filter } from '../mock/filter.js';
import NewWaypointPresenter from './new-waypoint-presenter.js';

export default class WaypointsPresenter {
  #waypointsContainer = null;
  #waypointsModel = null;
  #filterModel = null;

  #eventListComponent = new EventListView();
  #waypointPresenters = new Map();
  #newWaypointPresenter = null;
  #sortComponent = null;
  #NoWaypointComponent = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  constructor({ waypointsContainer, waypointsModel, filterModel, onNewWaypointDestroy }) {
    this.#waypointsContainer = waypointsContainer;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;

    this.#newWaypointPresenter = new NewWaypointPresenter({
      taskListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewWaypointDestroy,
    });

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get waypoints() {

    this.#filterType = this.#filterModel.filter;
    const waypoints = this.#waypointsModel.waypoints;
    const filteredWaypoints = filter[this.#filterType](waypoints);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredWaypoints.sort(sortPointByTime);
      case SortType.PRICE:
        return filteredWaypoints.sort(sortPointByPrice);
    }
    return filteredWaypoints;
  }

  init() {

    this.#renderPage();
  }

  createWaypoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newWaypointPresenter.init();
  }


  #handleModeChange = () => {
    this.#newWaypointPresenter.destroy();
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this.#waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointsModel.deleteWaypoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
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
    this.#renderPage();
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
    this.#NoWaypointComponent = new EmptyListMessage({filterType: this.#filterType});
    render(this.#NoWaypointComponent, this.#eventListComponent.element);
  }

  #clearPage({resetSortType = false} = {}) {
    this.#newWaypointPresenter.destroy();
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();

    remove(this.#sortComponent);

    if(this.#NoWaypointComponent) {
      remove(this.#NoWaypointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderWaypointsList() {
    render(this.#eventListComponent, this.#waypointsContainer);

    this.#renderWaypoints(this.waypoints);
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
