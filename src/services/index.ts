import ZFServiceNext from "@/api/services/zf";
import requestNext, { RequestCustomOptions } from "@/utils/request/requestImpl";

import { api } from "./api/apiList";
import { LoginByTaro } from "./services/authService";
import LibraryService from "./services/libraryService";
import LostfoundService from "./services/lostfoundService";
import SuitService from "./services/suitService";
import SystemService from "./services/systemService";
import UserService from "./services/userService";
import YxyService from "./services/yxyService";
import ZFService from "./services/zfService";
import errCodeHandler from "./utils/errHandler";

export {
  api,
  errCodeHandler,
  LibraryService,
  LoginByTaro,
  LostfoundService,
  SuitService,
  SystemService,
  UserService,
  YxyService,
  ZFService
};

export const zfServiceNext = new ZFServiceNext<RequestCustomOptions>({
  request: requestNext,
  baseURL: import.meta.env.VITE_HOST
});
