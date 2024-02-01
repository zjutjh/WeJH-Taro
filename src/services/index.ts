import ZFService from "./services/zfService";
import SystemService from "./services/systemService";
import UserService from "./services/userService";
import LibraryService from "./services/libraryService";
import CanteenService from "./services/canteenService";
import YxyService from "./services/yxyService";
import LostfoundService from "./services/lostfoundService";
import { LoginByTaro } from "./services/authService";
import errCodeHandler from "./utils/errHandler";
import { api } from "./api/apiList";
import SuitService from "./services/suitService";

export {
  ZFService,
  SystemService,
  UserService,
  LibraryService,
  CanteenService,
  YxyService,
  LostfoundService,
  SuitService,
  LoginByTaro,
  errCodeHandler,
  api
};
