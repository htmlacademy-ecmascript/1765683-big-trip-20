import Observable from '../framework/observable.js';
import { UpdateType } from '../util/const.js';

export default class WaypointsModel extends Observable {
  #waypointsApiService = null;

  #waypoints = [];
  #offers = [];
  #destinations = [];

  constructor({ waypointsApiService }) {
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  get waypoints() {
    return this.#waypoints;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const waypoints = await this.#waypointsApiService.waypoints;
      this.#offers = await this.#waypointsApiService.offers;
      this.#destinations = await this.#waypointsApiService.destinations;
      this.#waypoints = waypoints.map((waypoint) =>
        this.#adaptToClient(waypoint)
      );
      this._notify(UpdateType.INIT);
    } catch (err) {
      this.#waypoints = [];
      this.#offers = [];
      this.#destinations = [];
      this._notify(UpdateType.ERROR);
      throw new Error('Can\'t recive data properly');
    }
  }

  async updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(
      (waypoint) => waypoint.id === update.id
    );

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    try {
      const response = await this.#waypointsApiService.updateWaypoint(update);
      const updatedWaypoint = this.#adaptToClient(response);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        updatedWaypoint,
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType, updatedWaypoint);
    } catch (err) {
      throw new Error('Can\'t update waypoint');
    }
  }

  async addWaypoint(updateType, update) {
    try {
      const response = await this.#waypointsApiService.addWaypoint(update);
      const newWaypoint = this.#adaptToClient(response);

      this.#waypoints = [newWaypoint, ...this.#waypoints];
      this._notify(updateType, newWaypoint);
    } catch (err) {
      throw new Error('Can\'t add waypoint');
    }
  }

  async deleteWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(
      (waypoint) => waypoint.id === update.id
    );

    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }

    try {
      await this.#waypointsApiService.deleteWaypoint(update);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete waypoint');
    }
  }

  #findOffers(type, ids) {
    let offersArr = [];

    offersArr = this.offers.find((item) => item.type === type);
    offersArr = ids.map((id) =>
      offersArr.offers.find((item) => item.id === id)
    );
    return offersArr;
  }

  #adaptToClient(waypoint) {
    const adaptedWaypoint = {
      ...waypoint,
      basePrice: waypoint['base_price'],
      dateFrom:
        waypoint['date_from'] !== null
          ? new Date(waypoint['date_from'])
          : waypoint['date_from'],
      dateTo:
        waypoint['date_to'] !== null
          ? new Date(waypoint['date_to'])
          : waypoint['date_to'],
      isFavorite: waypoint['is_favorite'],
      destination: this.#destinations.find(
        (item) => item.id === waypoint.destination
      ),
      offers: this.#findOffers(waypoint.type, waypoint.offers),
    };

    delete adaptedWaypoint['base_price'];
    delete adaptedWaypoint['date_from'];
    delete adaptedWaypoint['date_to'];
    delete adaptedWaypoint['is_favorite'];

    return adaptedWaypoint;
  }
}
