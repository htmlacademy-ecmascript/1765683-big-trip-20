import { render } from '../render.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventNewView from '../view/event-new-view.js';
import EventView from '../view/event-view.js';

export default class WaypointPresenter {
  constructor({ eventContainer, waypointsModel }) {
    this.eventContainer = eventContainer;
    this.waypointsModel = waypointsModel;
  }

  eventListComponent = new EventListView();
  eventEditComponent = new EventEditView();
  newEventComponent = new EventNewView();

  init() {
    this.waypoints = [...this.waypointsModel.getWaypoints()];

    render(this.eventListComponent, this.eventContainer);
    render(this.eventEditComponent, this.eventListComponent.getElement());
    render(this.newEventComponent, this.eventListComponent.getElement());

    for (let i = 0; i < this.waypoints.length; i++) {
      render(
        new EventView({ waypoint: this.waypoints[i] }),
        this.eventListComponent.getElement()
      );
    }
  }
}
