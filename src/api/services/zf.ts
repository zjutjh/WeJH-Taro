import { ZfAPI } from "../types";
import { BaseService } from "./base";

export default class ZFService<TOptions> extends BaseService<TOptions> {
  QueryLessonsTable(
    req: ZfAPI.QueryLessonsTableRequest,
    options?: TOptions
  ): Promise<ZfAPI.QueryLessonsTableResponse> {
    const url = this.genBaseURL("/api/func/zf/classtable");
    const method = "POST";
    const data = req;

    return this.request({ url, method, data }, options);
  }
}
