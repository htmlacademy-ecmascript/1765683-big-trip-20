import dayjs from 'dayjs';

export function humanizeCalendarDateFromDate(date) {
  return date ? dayjs(date).format('MMM DD').toUpperCase() : '';
}

export function humanizeDateFromDate(date) {
  return date ? dayjs(date).format('YYYY-MM-DD').toUpperCase() : '';
}

export function humanizeTimeFromDate(date) {
  return date ? dayjs(date).format('HH:mm') : '';
}

export function humanizeDurationFromDates(from, to) {
  if (!from || !to) {
    return '';
  }

  const minutes = dayjs(to).diff(dayjs(from), 'minute');
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return ` ${days > 0 ? `${days}D` : ''} ${
    hours - days * 24 > 0 ? `${hours - days * 24}H` : ''
  } ${minutes - hours * 60}M`;
}

export function durationPoint(point) {
  return dayjs(point.dateTo).diff(dayjs(point.dateFrom));
}
