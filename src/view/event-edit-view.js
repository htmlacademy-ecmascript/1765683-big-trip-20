import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { DESTINATIONS } from '../mock/mock.js';
import { TRAVEL_WAYPOINTS, WAYPOINT_TYPES } from '../mock/const.js';

function createEventOffersSelectionTemplate(offers) {
  if (!offers.length) {
    return '';
  }

  const createOfferItemTemplate = (offer) => {
    const { id, title, price, isChecked } = offer;

    return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id} ${isChecked ? 'checked' : ''}">
        <label class="event__offer-label" for="event-offer-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
     </div>
     `;
  };

  return `
  <section class="event__section event__section--offers">
    <h3 class="event__section-title event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.map(createOfferItemTemplate).join('')}
    </div>
  </section>
  `;
}

function createEventDestinationSelectionTemplate(destination) {
  if (!destination) {
    return '';
  }

  const { description, pictures } = destination;

  const createPicturesTemplate = (photos) => {
    if(!photos.length) {
      return '';
    }

    return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
       ${photos.map((photo) => `
          <img class="event__photo" src="${photo.src}" alt="${photo.description}">
       `).join('')}
      </div>
    </div>
    `;

  };

  return `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    ${createPicturesTemplate(pictures)}
  </section>
  `;
}

function createEventEditTemplate(data) {
  const { basePrice, dateFrom, dateTo, destination, offers, type } = data;

  const timeFrom = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const timeTo = dayjs(dateTo).format('DD/MM/YY HH:mm');

  const createSelectTypesTemplate = (selectedType) => WAYPOINT_TYPES.map((waypointType) => {
    const checkedAttribute = waypointType === selectedType ? 'checked' : '';
    const lowerType = waypointType.toLowerCase();

    return `
    <div class="event__type-item">
     <input id="event-type-${lowerType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${lowerType}" ${checkedAttribute}>
     <label class="event__type-label  event__type-label--${lowerType}" for="event-type-${lowerType}-1">${waypointType}</label>
    </div>
    `;
  }).join('');

  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="${type}">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createSelectTypesTemplate(type)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${destination.name} list="destination-list-1">
            <datalist id="destination-list-1">
            ${TRAVEL_WAYPOINTS.map((point) => ` 
                  <option value="${point}"></option>
               `).join('')}
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice}>
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createEventOffersSelectionTemplate(offers)}
          ${createEventDestinationSelectionTemplate(destination)}
        </section>
      </form>
    </li>`;
}

const BLANK_EVENT = {};

const DEFAULT_FLATPICKR_OPTIONS = {
  enableTime: true,
  altInput: true,
  altFormat: 'd/m/y H:i',
  // eslint-disable-next-line camelcase
  time_24hr: true, // flatpickr option
};

export default class EventEditView extends AbstractStatefulView {
  #datePickerFrom = null;
  #datePickerTo = null;
  #handleSubmit = null;
  #handleDelete = null;
  #handleCancel = null;

  constructor({ waypoint = BLANK_EVENT, onFormSubmit, onDelete, onCancel }) {
    super();
    this._setState(EventEditView.parseWaypointToState(waypoint));
    this.#handleSubmit = onFormSubmit;
    this.#handleDelete = onDelete;
    this.#handleCancel = onCancel;

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
      .querySelector('form.event')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formCancelHandler);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('click', this.#eventTypeChangeHandler);
    this.element
      .querySelector('#event-price-1')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element
      .querySelector('#event-destination-1')
      .addEventListener('input', this.#priceChangeHandler);

    this.#setDatePickers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(this._state);
  };

  #formCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancel();
  };

  #formDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleDelete(EventEditView.parseStateToWaypoint(this._state));
  };

  #eventTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    const destination = DESTINATIONS.find(
      ({ name }) => name === evt.target.value
    );

    this.updateElement({ destination });
  };

  #priceChangeHandler = (evt) => {
    const basePrice = Number(evt.target.value);

    this.updateElement({ basePrice });
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

  #setDatePickers() {
    if (this._state.dateFrom) {
      this.#datePickerFrom = flatpickr(
        this.element.querySelector('input[name="event-start-time"]'),
        {
          ...DEFAULT_FLATPICKR_OPTIONS,
          defaultDate: this._state.dateFrom,
          onChange: this.#userFromDateChangeHandler,
        }
      );
    }

    if (this._state.dateTo) {
      this.#datePickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          ...DEFAULT_FLATPICKR_OPTIONS,
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
