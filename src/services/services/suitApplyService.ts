import request from "../request";
import { api } from "../api/apiList";
import { serviceStore } from "@/store";
import { SuitApplyRecord } from "@/types/Suit";

export default class SuitApplyService {
  static getRecords = (data:{
    campus?:number,
    status?:number,
  }) => {
    return request<{
      data: SuitApplyRecord[],
    }>(
      api.suit.record, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID },
        data
      }
    );
  };
  static deleteRecords = (data:{
    borrow_id?:number,
  }) => {
    return request(
      api.suit.record,{
        method:"POST",
        header: {"Cookie":serviceStore.sessionID},
        data
      }
    );
  };
}
