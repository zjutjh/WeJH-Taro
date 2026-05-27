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

  /** 查询考试安排 */
  QueryExamInfo(
    req: ZfAPI.QueryExamInfoRequest,
    options?: TOptions
  ): Promise<ZfAPI.QueryExamInfoResponse> {
    const url = this.genBaseURL("/api/func/zf/exam");
    const method = "POST";
    const data = req;

    return this.request({ url, method, data }, options);
  }
}
