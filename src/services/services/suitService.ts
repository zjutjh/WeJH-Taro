import request from "../request";
import { api } from "../api/apiList";
import { serviceStore } from "@/store";

export default class SuitService {
  static getSuitInfo = (data: {
    campus?: number
  }) => {
    return request<{
      name: string,
      img: string,
      specs: {
        id: number;
        spec: string;
        stock: number;
      }[]
    }[]>(
      api.suit.check, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID },
        data
      }
    );
  };

  static pushRentSuitInfo = (data: {
    supplies_id: number,
    count: number,
  }) => {
    return request<{
      code: number,
      msg: string,
      data: null
    }>(
      api.suit.submit, {
        method: "POST",
        header: { "Cookie": serviceStore.sessionID },
        data
      }
    );
  };
}
