import { request } from "@/utils";
import { api } from "../api/apiList";
import { BorrowBooksInfo } from "@/types/BorrowBooksInfo";

export default class LibraryService {
  // TODO: 图书馆接口重构后补充类型
  static async getLibraryCurrent() {
    return request<BorrowBooksInfo[]>(
      api.library.current, {
        method: "POST"
      }
    );
  }

  static async getLibraryHistory() {
    return request<BorrowBooksInfo[]>(
      api.library.history, {
        method: "POST"
      }
    );
  }
}
