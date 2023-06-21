import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const { type } = filter;

  return `
  <div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" 
    ${type === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>`;
}

function createFilterTemplate(filterItems, currentFilterType) {
  const filtersItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `
  <form class="trip-filters" action="#" method="get">
${filtersItemsTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>
`;
}

export default class FilterView extends AbstractView {
  #filters = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.currentFilterType = currentFilterType;
    this.onFilterTypeChange = onFilterTypeChange;

    this.element
      .querySelectorAll('.trip-filters__filter-input')
      .forEach((item) => {
        item.addEventListener('change', this.filterTypeChangeHandler);
      });
  }

  get template() {
    return createFilterTemplate(this.#filters, this.currentFilterType);
  }

  filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.onFilterTypeChange(evt.target.value);
  };
}
