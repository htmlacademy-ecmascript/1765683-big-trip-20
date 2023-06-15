import AbstractView from '../framework/view/abstract-view';

function createTripEventsListEmptyTemplate() {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class WaypointLoadingListView extends AbstractView {
  get template() {
    return createTripEventsListEmptyTemplate();
  }
}
