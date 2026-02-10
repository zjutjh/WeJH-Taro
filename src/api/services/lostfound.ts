import { LostfoundAPI } from "../types";
import { BaseService } from "./base";

export default class LostfoundService<TOptions> extends BaseService<TOptions> {
  QueryKindList(_?: unknown, options?: TOptions): Promise<LostfoundAPI.QueryKindListResponse> {
    return this.request(
      { url: this.genBaseURL("/api/func/lost/kind_list"), method: "GET" },
      options
    );
  }

  QueryLostRecords(
    req: LostfoundAPI.QueryLostRecordsRequest,
    options?: TOptions
  ): Promise<LostfoundAPI.QueryLostRecordsResponse> {
    return this.request(
      { url: this.genBaseURL("/api/func/lost"), method: "GET", data: req },
      options
    );
  }
}
