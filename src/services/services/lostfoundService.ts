import request from "../request";
import { api } from "../api/apiList";
import { serviceStore } from "@/store";
import type { LostfoundRecord } from "@/types/Lostfound";

export default class LostfoundService {
  static getRecords = (data: {
    campus?: string,
    kind?: string,
    page_num: number,
    page_size: number
  }) => {
    return request<{
      data: LostfoundRecord[],
      total_page_num: number
    }>(
      api.lostfound.record, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID },
        data
      }
    );
  };

  static getKindList = () => {
    return request<{
      id: number,
      kind_name: string;
    }[]>(
      api.lostfound.kind, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID },
      }
    );
  };
}
