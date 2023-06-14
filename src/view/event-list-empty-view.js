import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../mock/const.js';

const NoWaypointTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};


function createEmptyListMessageTemplate(filterType) {
  const noWaypointTextValue = NoWaypointTextType[filterType];
  return `<p class="trip-events__msg">${noWaypointTextValue}</p>`;
}

export default class EmptyListMessage extends AbstractView {

  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListMessageTemplate(this.#filterType);
  }
}
