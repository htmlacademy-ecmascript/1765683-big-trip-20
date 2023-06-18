import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { FilterType } from '../util/const.js';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const filter = {

  [FilterType.EVERYTHING]: (waypoints) => [...waypoints],
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => dayjs().isBefore(dayjs(waypoint.dateFrom))),
  [FilterType.PRESENT]: (waypoints) => waypoints.filter((waypoint) => {
    const now = dayjs();

    return now.isSameOrAfter(dayjs(waypoint.dateFrom)) && dayjs(waypoint.dateTo).isSameOrBefore(now);
  }),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => dayjs(waypoint.dateTo).isBefore(dayjs())),
};

