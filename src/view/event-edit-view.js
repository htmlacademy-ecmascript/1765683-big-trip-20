import { WAYPOINT_OPTIONS } from '../mock/const.js';
import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { mapWaypoints } from '../mock/mock.js';

function createEventEditTemplate(data) {
  const { basePrice, dateFrom, dateTo, destination, offers, type } = data;

  const timeFrom = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const timeTo = dayjs(dateTo).format('DD/MM/YY HH:mm');

  const createOffersByType = () => {
    let callOffers = '';
    if (offers.length) {
      callOffers = '';
      offers.forEach((offer) => {
        const checked = Math.random() > 0.5 ? 'checked' : '';
        if (offer.title && offer.price && offer.id) {
          callOffers += `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${checked}>
            <label class="event__offer-label" for="event-offer-${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`;
        }
      });
    }
    return callOffers;
  };

  const createSelectType = () => {
    let selectType = '';
    if (WAYPOINT_OPTIONS.length) {
      WAYPOINT_OPTIONS.forEach((typeEvent) => {
        const checked = typeEvent === type ? 'checked' : '';
        if (typeEvent) {
          selectType += `
          <div class="event__type-item">
            <input id="event-type-${typeEvent.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeEvent.toLowerCase()}" ${checked}>
            <label class="event__type-label  event__type-label--${typeEvent.toLowerCase()}" for="event-type-${typeEvent.toLowerCase()}-1">${typeEvent}</label>
          </div>`;
        }
      });
    }
    return selectType;
  };

  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createSelectType()}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${destination.name} list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="${destination.name}"></option>
              <option value="${destination.name}"></option>
              <option value="${destination.name}"></option>
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${timeFrom}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${timeTo}>
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">${basePrice}</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${createOffersByType()}
            </div>
          </section>
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
          </section>
        </section>
      </form>
    </li>`;
}

export default class EventEditView extends AbstractStatefulView {
  #datePickerFrom = null;
  #datePickerTo = null;
  #handleSubmit = null;
  #handleCancel = null;

  constructor({ waypoint, onFormSubmit, onFormCancel }) {
    super();
    this._setState(EventEditView.parseWaypointToState(waypoint));
    this.#handleSubmit = onFormSubmit;
    this.#handleCancel = onFormCancel;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  reset(waypoint) {
    this.updateElement(EventEditView.parseWaypointToState(waypoint));
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__save-btn')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formCancelHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formCancelHandler);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('click', this.#eventTypeChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#formDestChangeHandler);

    this.#setDatePicker();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(this._state);
  };

  #formCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancel();
  };

  #eventTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
      });
    }
  };

  #formDestChangeHandler = (evt) => {
    mapWaypoints.get(evt.target.value);
    this.updateElement({
      destination: mapWaypoints.get(evt.target.value)
    });
  };

  #userFromDateChangeHandler = ([userDateFrom]) => {
    this.updateElement({
      dateFrom: userDateFrom,
    });
  };

  #userToDateChangeHandler = ([userDateTo]) => {
    this.updateElement({
      dateTo: userDateTo,
    });
  };

  #setDatePicker() {
    if (this._state.dateFrom) {
      this.#datePickerFrom = flatpickr(
        this.element.querySelector('input[name="event-start-time"]'),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true, // flatpickr property
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          onChange: this.#userFromDateChangeHandler,
        }
      );
    }

    if (this._state.dateTo) {
      this.#datePickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true, // flatpickr property
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          onChange: this.#userToDateChangeHandler,
        }
      );
    }
  }

  static parseWaypointToState(waypoint) {
    return { ...waypoint };
  }

  static parseStateToWaypoint(state) {
    const waypoint = { ...state };

    return waypoint;
  }
}
