import AbstractView from '../framework/view/abstract-view.js';
import {
  humanizeCalendarDateFromDate,
  humanizeDateFromDate,
  humanizeDurationFromDates,
  humanizeTimeFromDate,
} from '../util/util.js';

function createEventOfferTemplate(offer) {
  return `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>`;
}

function createEventTemplate(data) {
  const { basePrice, dateFrom, dateTo, destination, isFavorite, offers, type } = data;

  const isFavoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
    <div class="event">
        <time class="event__date" datetime="${humanizeDateFromDate(dateFrom)}">${humanizeCalendarDateFromDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${humanizeTimeFromDate(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${humanizeTimeFromDate(dateTo)}</time>
          </p>
          <p class="event__duration">${humanizeDurationFromDates(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${offers.map(createEventOfferTemplate).join('')}
        </ul>
        <button class="event__favorite-btn ${isFavoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
      </li>`;
}

export default class EventView extends AbstractView {

  #waypoint = null;
  #onEditClick = null;
  #onFavoriteClick = null;

  constructor({ waypoint, onEditClick, onFavoriteClick }) {
    super();
    this.#waypoint = waypoint;
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#openClickHandler);

    this.element
      .querySelector('.event__favorite-icon')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventTemplate(this.#waypoint);
  }

  #openClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };

}
