export type DeleteUserRequest = {
  stuid: string;
  iid: string;
};

export type ChangePasswordRequest = {
  iid: string;
  stuid: string;
  password: string;
};
