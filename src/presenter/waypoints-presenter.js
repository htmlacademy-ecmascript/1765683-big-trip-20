import { remove, render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EmptyListMessage from '../view/event-list-empty-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';
import { sortPointByPrice, sortPointByTime } from '../util/waypoints.js';
import SortView from '../view/sort-view.js';
import { SortType, UpdateType, UserAction, FilterType } from '../util/const.js';
import { filter } from '../util/filter.js';
import NewWaypointPresenter from './new-waypoint-presenter.js';
import WaypointLoadingListView from '../view/waypoints-loading-list-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class WaypointsPresenter {
  #waypointsContainer = null;
  #waypointsModel = null;
  #filterModel = null;

  #eventListComponent = new EventListView();
  #waypointPresenters = new Map();
  #loadingComponent = new WaypointLoadingListView();
  #newWaypointPresenter = null;
  #sortComponent = null;
  #NoWaypointComponent = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ waypointsContainer, waypointsModel, filterModel, onNewWaypointDestroy }) {
    this.#waypointsContainer = waypointsContainer;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;

    this.#newWaypointPresenter = new NewWaypointPresenter({
      eventListContainer: this.#eventListComponent.element,
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointPresenters.get(update.id).setSaving();
        try {
          await this.#waypointsModel.updateWaypoint(updateType, update);
        } catch(err) {
          this.#waypointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_WAYPOINT:
        this.#newWaypointPresenter.setSaving();
        try {
          await this.#waypointsModel.addWaypoint(updateType, update);
        } catch(err) {
          this.#newWaypointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointPresenters.get(update.id).setDeleting();
        try {
          await this.#waypointsModel.deleteWaypoint(updateType, update);
        } catch(err) {
          this.#waypointPresenters.get(update.id).setAborting();
        }

        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #renderLoading() {
    render(this.#loadingComponent, this.#waypointsContainer);
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

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (!waypoints.length) {
      this.#renderNoWaypoints();
      return;
    }

    this.#renderSort();
    this.#renderWaypointsList();
  }
}
