import { api } from "../api/apiList";
import { Lesson } from "@/types/Lesson";
import { Exam } from "@/types/Exam";
import { FinalTermScore, MidTermScore } from "@/types/Score";
import { request } from "@/utils";
import { Room } from "@/types/Room";

export default class ZFService {
  static getExamInfo(params: { year: string; term: "上" | "下" | "短" }) {
    return request<Exam[] | null>(
      api.zf.examInfo, {
        method: "POST",
        params
      }
    );
  }

  static getMidTermScore(params: { year: string, term: string }) {
    return request<MidTermScore[]>(
      api.zf.midtermscoreInfo, {
        method: "POST",
        params
      }
    );
  }

  static getFinalTermScore(params: { year: string, term: string }) {
    return request<FinalTermScore[]>(
      api.zf.scoreInfo, {
        method: "POST",
        params
      }
    );
  }

  static async getFreeRoomInfo(params: {
    year: string;
    term: string;
    campus: string;
    weekday: string;
    sections: string;
    week: string;
  }) {
    return request<Room[]>(
      api.zf.freeroom, {
        method: "POST",
        params
      }
    );
  }

  static getLessonTable(params: { year: string; term: string; }) {
    return request<{
      lessonsTable: Lesson[] | null
    }>(api.zf.lessonTable, {
      method: "POST",
      params
    });
  }
}
