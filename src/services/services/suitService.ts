import request from "../request";
import { api } from "../api/apiList";
import { serviceStore } from "@/store";
import {SuitFaq} from "@/types/Suit";

export default class suitService {
  static getFaq = (data: {
    publisher: string
  }) => {
    return request<SuitFaq[]>(
      api.suit.getFaq, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID },
        data
      }
    );
  };

  static getInformation = () => {
    return request<{
        id: number,
        name: string,
        gender: string,
        student_id: string,
        college: string,
        dormitory: string,
        contact: string;
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
