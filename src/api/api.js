import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class WayPointsApiService extends ApiService {

  get waypoints () {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get offers () {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  get destinations () {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  async updatePoint(waypoint) {
    const response = await this._load({
      url: `/points/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(waypoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(waypoint) {
    const adaptedPoint = {
      ...waypoint,
      'base_price': waypoint.basePrice,
      'date_from': waypoint.dateFrom instanceof Date ? waypoint.dateFrom.toISOString() : null,
      'date_to': waypoint.dateTo instanceof Date ? waypoint.dateTo.toISOString() : null,
      'is_favorite': waypoint.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
