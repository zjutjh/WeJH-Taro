import dayjs, { Dayjs } from "dayjs";

import { ParsedBusSchedule } from "../../_types";

export const isDirectLine = (item: ParsedBusSchedule) => {
  return item.busName.includes("直达");
};

export const isWithinFuture24h = (startTime: Dayjs, endTime: Dayjs) => {
  const now = dayjs();
  const future24h = now.add(24, "hour");
  // Check overlap: Start before end of window AND End after start of window
  return startTime.isBefore(future24h) && endTime.isAfter(now);
};

export const filterByTimeRange = (list: ParsedBusSchedule[], startTime: Dayjs, endTime: Dayjs) => {
  return list.filter((item) => {
    return (
      (item.departureTime.isSame(startTime) || item.departureTime.isAfter(startTime)) &&
      item.departureTime.isBefore(endTime)
    );
  });
};
