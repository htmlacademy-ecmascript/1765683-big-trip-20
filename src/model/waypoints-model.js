
import { getRandomData } from '../mock/mock.js';

const WAYPOINTS_COUNT = 5;


export default class WaypointsModel {
  #waypoints = Array.from({length: WAYPOINTS_COUNT}, getRandomData);

  get waypoints() {
    return this.#waypoints;
  }

}
