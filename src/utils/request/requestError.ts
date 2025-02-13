export enum MPErrorCode {
  /** 客户端网络环境异常 */
  MP_NETWORK_ERROR = "MP_NETWORK_ERROR",
  /** 服务端响应体异常 */
  MP_INVALID_RESPONSE_BODY = "MP_INVALID_RESPONSE_BODY",
  /** 响应数据中 data 字段非法 */
  MP_INVALID_DATA_VALUE = "MP_INVALID_DATA_VALUE",
  /** 未知登录异常 */
  MP_LOGIN_ERROR_UNKNOWN = "MP_LOGIN_ERROR_UNKNOWN"
}

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

type RequestErrorCodeType = ServiceErrorCode | MPErrorCode | number;

export default class RequestError extends Error {
  public message: string;
  public code: RequestErrorCodeType;

  constructor(message: string, code: RequestErrorCodeType) {
    super();
    this.message = message;
    this.code = code;
  }
}
