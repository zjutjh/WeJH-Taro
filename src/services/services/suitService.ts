import { request } from "@/utils";
import { api } from "../api/apiList";
import { SuitFaq, SuitApplyRecord } from "@/types/Suit";

export default class suitService {
  static getFaq = (params: {
    publisher: string
  }) => {
    return request<SuitFaq[]>(
      api.suit.getFaq, {
        params
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
    }>(api.suit.getInformation);
  };

  static changeInformation = (params: {
    name: string,
    gender: string,
    college: string,
    dormitory: string,
    contact: string;
  }) => {
    return request<null>(
      api.suit.changeInformation, {
        method: "POST",
        params
      }
    );
  };

  static getSuitInfo = (params: {
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
        params
      }
    );
  };

  static pushRentSuitInfo = (params: {
    supplies_id: number,
    count: number,
  }) => {
    return request<null>(
      api.suit.submit, {
        method: "POST",
        params
      }
    );
  };

  static getRecords = (params: {
    campus?: number,
    status?: number,
  }) => {
    return request<SuitApplyRecord[]>(
      api.suit.record, {
        params
      }
    );
  };
  static deleteRecords = (params: {
    borrow_id?: number,
  }) => {
    return request(
      `${api.suit.record}?borrow_id=${params.borrow_id}`,
      {
        method: "DELETE"
      }
    );
  };
}
