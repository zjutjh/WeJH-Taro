import request from "../request";
import { api } from "../api/apiList";
import { serviceStore } from "@/store";
import { SuitFaq, SuitApplyRecord } from "@/types/Suit";

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
        header: { "Cookie": serviceStore.sessionID }
      }
    );
  };

  static changeInformation = (data: {
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

  static getRecords = (data: {
    campus?: number,
    status?: number,
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
  static deleteRecords = (data: {
    borrow_id?: number,
  }) => {
    return request(
      `${api.suit.record}?borrow_id=${data.borrow_id}`,
      {
        method: "DELETE",
        header: { "Cookie": serviceStore.sessionID },
        data
      }
    );
  };
}
