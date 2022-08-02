export const ServerCode = {
  OK: 1,
  // static SystemError: -1;
  ParamError: 100501,
  UserNotFound: -301,
  // static UserAlreadyExisted: -302;
  UserCenterNotFound: 300501,
  UserCenterNotMatch: 300502,
  NotLogin: 100401,
  NotAdmin: 100403,
  // wechat
  NoThatPasswordORWrong: 400504,
  HttpTimeout: -501,
  // bind
  NotInit: -502,
  Unknown: -1000,

  UserAlreadyExisted: 200508,
  UsernamePasswordUnmatched: 200504,
  // static UsernamePasswordUnmatched: -500,
  UserNotLogin: 200503,
  GetOpenIDFail: 200500,
  SystemError: 200507,

  bind: {
    schoolCardServerError: 200506
  },
  activation: {
    schoolIdOrIdNotExistNotMatch: 200510,
    passwordLenghtError: 200511,
    passportExisted: 200512
  }
};
