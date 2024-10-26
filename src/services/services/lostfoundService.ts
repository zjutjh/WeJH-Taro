import { api } from "../api/apiList";
import type { LostfoundRecord } from "@/types/Lostfound";
import { request } from "@/utils";

export default class LostfoundService {
  static getRecords = (params: {
    campus?: string,
    kind?: string,
    page_num: number,
    page_size: number,
    lost_or_found?: string
  }) => {
    return request<{
      data: LostfoundRecord[],
      total_page_num: number
    }>(api.lostfound.record, { params });
  };

  static getKindList = () => {
    return request<{
      id: number,
      kind_name: string;
    }[]>(api.lostfound.kind);
  };
}
