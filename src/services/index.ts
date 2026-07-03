import LostfoundServiceNext from "@/api/services/lostfound";
import UserServiceNext from "@/api/services/user";
import YxyServiceNext from "@/api/services/yxy";
import ZFServiceNext from "@/api/services/zf";
import { type RequestCustomOptions, requestNext } from "@/utils/request-next";

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

export { api } from "./api/apiList";
export { LoginByTaro } from "./services/authService";
export { default as LibraryService } from "./services/libraryService";
export { default as SuitService } from "./services/suitService";
export { default as SystemService } from "./services/systemService";
export { default as UserService } from "./services/userService";
export { default as YxyService } from "./services/yxy-service";
export { default as ZFService } from "./services/zf-service";
export { default as errCodeHandler } from "./utils/errHandler";
