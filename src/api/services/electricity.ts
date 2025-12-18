import { ElectricityAPI } from "../types";
import { BaseService } from "./base";

export default class ElectricityService<TOptions> extends BaseService<TOptions> {
  QueryBalance(
    req: ElectricityAPI.QueryBalanceRequest,
    options?: TOptions
  ): Promise<ElectricityAPI.QueryBalanceResponse> {
    return this.request(
      { url: this.genBaseURL("/api/func/electricity/balance"), method: "GET", data: req },
      options
    );
  }
  QueryChargeRecord(
    req: ElectricityAPI.QueryChargeRecordRequest,
    options?: TOptions
  ): Promise<ElectricityAPI.QueryChargeRecordResponse> {
    return this.request(
      { url: this.genBaseURL("/api/func/electricity/record"), method: "POST", data: req },
      options
    );
  }
  QueryConsumptionRecord(
    req: ElectricityAPI.QueryConsumptionRecordRequest,
    options?: TOptions
  ): Promise<ElectricityAPI.QueryConsumptionRecordResponse> {
    return this.request(
      { url: this.genBaseURL("/api/func/electricity/consumption"), method: "GET", data: req },
      options
    );
  }
  CreateSubscription(
    req?: ElectricityAPI.CreateSubscriptionRequest,
    options?: TOptions
  ): Promise<null> {
    return this.request(
      { url: this.genBaseURL("/api/func/electricity/subscription"), method: "POST", data: req },
      options
    );
  }
  QuerySubscription(
    req: ElectricityAPI.QuerySubscriptionRequest,
    options?: TOptions
  ): Promise<ElectricityAPI.QuerySubscriptionResponse> {
    return this.request(
      { url: this.genBaseURL("/api/func/electricity/subscription"), method: "GET", data: req },
      options
    );
  }
}
