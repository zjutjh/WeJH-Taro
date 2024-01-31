import request from "../request";
import { api } from "../api/apiList";
import { serviceStore } from "@/store";
export default class suitService {
  static getInformation = () => {
    return request<{
      code: number,
      msg: string,
      data: {
        id: number,
        name: string,
        gender: string,
        student_id: string,
        college: string,
        dormitory: string,
        contact: string;
      }
    }>(
      api.suit.getInformation, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID },
      }
    );
  };

  static changeInformation = (data:{
    name: string,
    gender: string,
    college: string,
    dormitory: string,
    contact: string;
  }) => {
    return request<{
      code: number,
      msg: string,
      data: null;
    }>(
      api.suit.changeInformation, {
        method: "POST",
        header: { "Cookie": serviceStore.sessionID },
        data
      }
    );
  };
}
