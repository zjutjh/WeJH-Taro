import { YxyAPI } from "../types";
import { BaseService } from "./base";

export default class YxyService<TOptions> extends BaseService<TOptions> {
  QueryBalance(
    req: YxyAPI.QueryBalanceRequest,
    options?: TOptions
  ): Promise<YxyAPI.QueryBalanceResponse> {
    return this.request(
      { url: this.genBaseURL("/api/func/electricity/balance"), method: "GET", data: req },
      options
    );
  }
  QueryChargeRecord(
    req: YxyAPI.QueryChargeRecordRequest,
    options?: TOptions
  ): Promise<YxyAPI.QueryChargeRecordResponse> {
    return this.request(
      { url: this.genBaseURL("/api/func/electricity/record"), method: "POST", data: req },
      options
    );
  }
  QueryConsumptionRecord(
    req: YxyAPI.QueryConsumptionRecordRequest,
    options?: TOptions
  ): Promise<YxyAPI.QueryConsumptionRecordResponse> {
    return this.request(
      { url: this.genBaseURL("/api/func/electricity/consumption"), method: "GET", data: req },
      options
    );
  }
  CreateSubscription(req?: YxyAPI.CreateSubscriptionRequest, options?: TOptions): Promise<null> {
    return this.request(
      { url: this.genBaseURL("/api/func/electricity/subscription"), method: "POST", data: req },
      options
    );
  }
  QuerySubscription(
    req: YxyAPI.QuerySubscriptionRequest,
    options?: TOptions
  ): Promise<YxyAPI.QuerySubscriptionResponse> {
    return this.request(
      { url: this.genBaseURL("/api/func/electricity/subscription"), method: "GET", data: req },
      options
    );
  }
  QueryBusInfo(
    req: YxyAPI.QueryBusInfoRequest,
    options?: TOptions
  ): Promise<YxyAPI.QueryBusInfoResponse> {
    const url = this.genBaseURL("/api/func/bus/info");
    const method = "GET";
    const params = req;

    return this.request({ url, method, params }, options);
  }
  QueryBusConfig(options?: TOptions): Promise<YxyAPI.QueryBusConfigResponse> {
    return this.request({ url: this.genBaseURL("/api/func/bus/config"), method: "GET" }, {
      ...options,
      isRaw: true
    } as TOptions & { isRaw: boolean });
  }
  QueryBusAnnounce(
    req: YxyAPI.QueryBusAnnounceRequest,
    options?: TOptions
  ): Promise<YxyAPI.QueryBusAnnounceResponse> {
    return this.request(
      {
        url: this.genBaseURL("/api/func/bus/announcement"),
        method: "GET",
        data: req
      },
      options
    );
  }
}
