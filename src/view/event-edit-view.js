import { WAYPOINT_OPTIONS } from '../const.js';
import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

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
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="${type}">
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Chamonix" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="${destination}"></option>
              <option value="${destination}"></option>
              <option value="${destination}"></option>
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">${timeFrom}</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">${timeTo}</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
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

export default class EventEditView extends AbstractView {
  #waypoint = null;
  #handleSubmit = null;
  #handleCancel = null;

  constructor({ waypoint, onFormSubmit, onFormCancel }) {
    super();
    this.#waypoint = waypoint;
    this.#handleSubmit = onFormSubmit;
    this.#handleCancel = onFormCancel;

    this.element
      .querySelector('.event__save-btn')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formCancelHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formCancelHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit();
  };

  #formCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancel();
  };

  get template() {
    return createEventEditTemplate(this.#waypoint);
  }
}
