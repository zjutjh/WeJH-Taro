export const ServerCode = {
  OK: 1,

  NotAdmin: 100403,
  UserAlreadyExisted: 200508,
  UsernamePasswordUnmatched: 200504,
  UserNotLogin: 200503,

  SystemError: 200500,

  bind: {
    schoolCardServerError: 200506
  },
  activation: {
    schoolIdOrIdNotExistNotMatch: 200510,
    passwordLenghtError: 200511,
    passportExisted: 200512,
    schooldIdError: 200513
  }
};
