import { dayScheduleStartTime } from "./dayScheduleStartTime";
import { updateInfo } from "./updateInfo";

export { dayScheduleStartTime, updateInfo };

export interface Option<T = string> {
  label: string;
  value: T;
}
