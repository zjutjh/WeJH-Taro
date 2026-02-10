import { YxyAPI } from "../types";
import { BaseService } from "./base";

export default class YxyService<TOptions> extends BaseService<TOptions> {
  QueryElectricityBalance(
    req: YxyAPI.QueryBalanceRequest,
    options?: TOptions
  ): Promise<YxyAPI.QueryBalanceResponse> {
    const url = this.genBaseURL("/api/func/electricity/balance");
    const method = "GET";
    const params = req;

    return this.request({ url, method, params }, options);
  }

  QueryElectricityChargeRecord(
    req: YxyAPI.QueryChargeRecordRequest,
    options?: TOptions
  ): Promise<YxyAPI.QueryChargeRecordResponse> {
    const url = this.genBaseURL("/api/func/electricity/record");
    const method = "POST";
    const data = req;

    return this.request({ url, method, data }, options);
  }

  QueryElectricityConsumptionRecord(
    req: YxyAPI.QueryConsumptionRecordRequest,
    options?: TOptions
  ): Promise<YxyAPI.QueryConsumptionRecordResponse> {
    const url = this.genBaseURL("/api/func/electricity/consumption");
    const method = "GET";
    const params = req;

    return this.request({ url, method, params }, options);
  }

  CreateElectricitySubscription(_?: unknown, options?: TOptions): Promise<null> {
    const url = this.genBaseURL("/api/func/electricity/subscription");
    const method = "POST";

    return this.request({ url, method }, options);
  }

  QueryElectricitySubscription(
    req: YxyAPI.QuerySubscriptionRequest,
    options?: TOptions
  ): Promise<YxyAPI.QuerySubscriptionResponse> {
    const url = this.genBaseURL("/api/func/electricity/subscription");
    const method = "GET";
    const params = req;

    return this.request({ url, method, params }, options);
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

  QueryBusConfig(_?: unknown, options?: TOptions): Promise<YxyAPI.QueryBusConfigResponse> {
    const url = this.genBaseURL("/api/func/bus/config");
    const method = "GET";

    return this.request({ url, method }, options);
  }

  QueryBusAnnounce(
    req: YxyAPI.QueryBusAnnounceRequest,
    options?: TOptions
  ): Promise<YxyAPI.QueryBusAnnounceResponse> {
    const url = this.genBaseURL("/api/func/bus/announcement");
    const method = "GET";
    const params = req;

    return this.request({ url, method, params }, options);
  }
}
