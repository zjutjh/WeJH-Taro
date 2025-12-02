import { YxyAPI } from "../types";
import { BaseService } from "./base";

export default class YxyService<TOptions> extends BaseService<TOptions> {
  QueryBusInfo(
    req: YxyAPI.QueryBusInfoRequest,
    options?: TOptions
  ): Promise<YxyAPI.QueryBusInfoResponse> {
    const url = this.genBaseURL("/api/func/bus/info");
    const method = "GET";
    const data = req;

    return this.request({ url, method, data }, options);
  }
}
