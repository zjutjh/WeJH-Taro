import { ejectCookies, cookiesToString } from "./cookie";
import { isNewIPhone, scrollViewHeight, getCopyRight } from "./effects";
import { fetch } from "./fetch";
import { checkBind } from "./checkBind";
import { checkNotification } from "./checkNotification";
import timeUtils from "./time";
import type { ICookie } from "./cookie";
import type { FetchResult } from "./fetch";
import { throttle } from "./throttle";
import { debounce } from "./debounce";

export {
  ICookie,
  FetchResult,
  ejectCookies,
  cookiesToString,
  isNewIPhone,
  scrollViewHeight,
  getCopyRight,
  fetch,
  checkBind,
  checkNotification,
  timeUtils,
  throttle,
  debounce
};
