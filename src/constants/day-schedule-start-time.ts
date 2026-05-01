interface DayScheduleStartTimeType {
  hour: number;
  min: number;
}

/**
 * 每节课程的开始时间，共 12 节课
 */
export const DAY_SCHEDULE_START_TIME: DayScheduleStartTimeType[] = [
  { hour: 8, min: 0 },
  { hour: 8, min: 55 },
  { hour: 9, min: 55 },
  { hour: 10, min: 50 },
  { hour: 11, min: 45 },
  { hour: 13, min: 30 },
  { hour: 14, min: 25 },
  { hour: 15, min: 25 },
  { hour: 16, min: 20 },
  { hour: 18, min: 30 },
  { hour: 19, min: 25 },
  { hour: 20, min: 20 }
];
