import LostfoundServiceNext from "@/api/services/lostfound";
import UserServiceNext from "@/api/services/user";
import YxyServiceNext from "@/api/services/yxy";
import ZFServiceNext from "@/api/services/zf";
import { type RequestCustomOptions, requestNext } from "@/utils/request-next";

import { api } from "./api/apiList";
import { LoginByTaro } from "./services/authService";
import LibraryService from "./services/libraryService";
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
  SuitService,
  SystemService,
  UserService,
  YxyService,
  ZFService
};

export const userServiceNext = new UserServiceNext<RequestCustomOptions>({
  request: requestNext,
  baseURL: import.meta.env.VITE_HOST
});

export const zfServiceNext = new ZFServiceNext<RequestCustomOptions>({
  request: requestNext,
  baseURL: import.meta.env.VITE_HOST
});

export const yxyServiceNext = new YxyServiceNext<RequestCustomOptions>({
  request: requestNext,
  baseURL: import.meta.env.VITE_HOST
});

export const lostfoundServiceNext = new LostfoundServiceNext<RequestCustomOptions>({
  request: requestNext,
  baseURL: import.meta.env.VITE_HOST
});
