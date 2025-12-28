import { OpenTypeEnum, ParsedBusSchedule } from "../_types";
import { BusScheduleTableRow } from "./_types";

/**
 * 合并后端数据和配置维护的班车详情数据
 */
const mergeBusData = (
  routeName: string,
  startCampus: string,
  endCampus: string,
  dynamicList: ParsedBusSchedule[]
): BusScheduleTableRow[] => {
  const staticName = `${routeName}（${startCampus}-${endCampus}）`;
  const routeConfig = busConfig.value?.find((item) => item.name === staticName);

  // TODO: 判空逻辑有问题
  if (!routeConfig) return [];

  return routeConfig.bus_time.map((scheduleConfig) => {
    // TODO: 这里可能有问题
    const [configHour, configMinute] = scheduleConfig.departure_time.split(":").map(Number);
    const openType = scheduleConfig.open_type as OpenTypeEnum;

    const dynamicItem = dynamicList.find(
      (item) =>
        item.departureTime.hour() === configHour && item.departureTime.minute() === configMinute
    );

    // 如果后端拉取到的表里有这个班次, 那么就是正常使用
    if (dynamicItem) {
      return {
        ...dynamicItem,
        openType
      };
    }
    // 如果表里没有, 那么就仅做默认静态数据展示
    // (表里没有也得展示静态数据, 是为了让用户感受到'工作日''节假日'的区别)
    return {
      departureHour: configHour,
      departureMinute: configMinute,
      openType,
      routeName,
      start: startCampus,
      end: endCampus
    };
  });
};
