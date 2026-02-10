import { UserAPI } from "../types";
import { BaseService } from "./base";

export default class UserService<TOptions> extends BaseService<TOptions> {
  DeleteUser(req: UserAPI.DeleteUserRequest, options?: TOptions): Promise<null> {
    const url = this.genBaseURL("/api/user/del");
    const method = "POST";
    const data = req;

    return this.request({ url, method, data }, options);
  }
}
