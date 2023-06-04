import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import EmptyListMessage from '../view/event-list-empty-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';
import { sortPointByPrice, sortPointByTime } from '../mock/waypoints.js';
import SortView from '../view/sort-view.js';
import { SortType } from '../mock/const.js';

export default class WaypointsPresenter {
  #waypointsContainer = null;
  #waypointsModel = null;

  #eventListComponent = new EventListView();
  #waypointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DEFAULT;

  constructor({ waypointsContainer, waypointsModel }) {
    this.#waypointsContainer = waypointsContainer;
    this.#waypointsModel = waypointsModel;

    this.#waypointsModel.addObservable(this.#handleModelEvent);
  }

  get waypoints() {

    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#waypointsModel.waypoints].sort(sortPointByTime);
      case SortType.PRICE:
        return [...this.#waypointsModel.waypoints].sort(sortPointByPrice);
      default:
        return this.#waypointsModel.waypoints;
    }
  }

  init() {

    this.#renderPage();
  }


  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  };;


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
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
    const waypoints = this.waypoints;

    if (!waypoints.length) {
      this.#renderNoWaypoints();
      return;
    }

    this.#renderSort();
    this.#renderWaypointsList();
  }
}
