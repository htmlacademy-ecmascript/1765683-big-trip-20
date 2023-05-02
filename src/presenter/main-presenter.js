import EventView from '../view/event-view.js';
import EventListView from '../view/event-list-view.js';
import EventNewView from '../view/event-new-view.js';
import EventEditView from '../view/event-edit-view.js';
import SortView from '../view/sort-view.js';
import { render } from '../render.js';

export default class MainPresenter {
  eventListComponent = new EventListView();
  sortComponent = new SortView();
  eventEditComponent = new EventEditView();
  newEventComponent = new EventNewView();
  eventComponent = new EventView();

  constructor({eventContainer}){
    this.eventContainer = eventContainer;
  }

  init(){
    render(this.sortComponent, this.eventContainer);
    render(this.eventListComponent, this.eventContainer);
    render(this.eventEditComponent, this.eventListComponent.getElement());
    render(this.newEventComponent, this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(this.eventComponent, this.eventListComponent.getElement());
    }

  }
}
