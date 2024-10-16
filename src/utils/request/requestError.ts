export const MPErrorCode = {
  MP_NETWORK_ERROR: Symbol("MP_NETWORK_ERROR")
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

  constructor(props: {
    message: string;
    code: ServiceErrorCode | number | symbol;
  }) {
    super();
    this.message = props.message;
    this.code = props.code;
  }
}
