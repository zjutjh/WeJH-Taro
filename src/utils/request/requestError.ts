export const MPErrorCode = {
  /** 客户端网络环境异常 */
  MP_NETWORK_ERROR: Symbol("MP_NETWORK_ERROR"),
  /** 服务端响应体异常 */
  MP_INVALID_RESPONSE_BODY: Symbol("MP_INVALID_RESPONSE_BODY"),
  /** 微信登录流程中缺失 code */
  MP_LOGIN_ERROR_MISSING_WX_CODE: Symbol("MP_LOGIN_ERROR_MISSING_WX_CODE"),
  /** 服务端激活流程中缺失 Cookie */
  MP_LOGIN_ERROR_MISSING_COOKIE: Symbol("MP_LOGIN_ERROR_MISSING_COOKIE"),
  /** 服务端登录流程中缺失 Cookie */
  MP_ACTIVATE_ERROR_MISSING_COOKIE: Symbol("MP_ACTIVATE_ERROR_MISSING_COOKIE"),
  /** 未知登录异常 */
  MP_LOGIN_ERROR_UNKNOWN: Symbol("MP_LOGIN_ERROR_UNKNOWN")
};

export enum ServiceErrorCode {
  OK = 1,
  NOT_ADMIN = 100403,

  USER_ALREADY_EXISTED = 200508,
  USER_USERNAME_PASSWORD_UNMATCHED = 200504,
  USER_NOT_LOGIN = 200503,

  SYSTEM_ERROR_1 = 200500,
  SYSTEM_ERROR_2 = 200506,

  ACTIVATION_SCHOOL_ID_OR_ID_NOT_EXIST_NOT_MATCH = 200510,
  ACTIVATION_PASSWORD_LENGTH_ERROR = 200511,
  ACTIVATION_PASSPORT_EXISTED = 200512,
  ACTIVATION_SCHOOL_ID_ERROR = 200513
}

export default class RequestError extends Error {
  public message: string;
  public code: ServiceErrorCode | number | symbol;

  constructor(message: string, code: ServiceErrorCode | number | symbol) {
    super();
    this.message = message;
    this.code = code;
  }
}
