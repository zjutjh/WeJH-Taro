import { CardServiceStore, CardServiceType } from "./card";
import { UserServiceStore, UserType } from "./user";
import { LibraryServiceStore } from "./library";
import { ZFServiceStore, ZFServiceType } from "./zf";
import { BorrowBooksInfo } from "@/types/BorrowBooksInfo";
import { AnnouncementStore, AnnouncementType } from "./announcement";
import { InformationStore, InformationStoreType } from "./information";
import { AppListItem } from "@/types/AppList";
import { ScoreServiceStore } from "./score";
import { HomeCardServiceStore, HomeCardServiceType } from "./homecard";
import { ElectricityServiceStore } from "./electricity";
import { WebviewStore, WebviewStoreType } from "./webview";
import { LostfoundStore, LostfoundStoreType } from "./lostfound";
import { NotificationStore, NotificationStoreType } from "./notification";
import { ThemeStore, ThemeStoreType } from "./theme";
import { SuitStore, SuitStoreType } from "./suit";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface ServiceStoreType {
  appList?: AppListItem[];
  card: CardServiceType;
  user: UserType;
  sessionID?: string;
  webview: WebviewStoreType;
  announcement: AnnouncementType;
  information: InformationStoreType;
  electricity: {
    roomName: string;
    roomCode: string;
    balance: number;
    todayConsumption: string;
    updateTime: {
      balance: Date;
    }
  }
  score: {
    readScoreMarks: Array<{
      name: string;
      scorePoint: string;
      val: boolean;
    }>
    findNewScoresTime: Date;
    scorePeriod: "期中" | "期末";
  }
  library: {
    history: BorrowBooksInfo[];
    current: BorrowBooksInfo[];
    updateTime: { history: string; current: string };
  };
  zf: ZFServiceType;
  lostFound: LostfoundStoreType;
  homeCard: HomeCardServiceType;
  notification: NotificationStoreType;
  theme: ThemeStoreType;
  suit: SuitStoreType;
}

export const useServiceStore = defineStore("service", () => {
  const sessionID = ref<string | undefined>(undefined);
  const appList = ref<AppListItem[]>();
  const setSession = (value: string) => {
    sessionID.value = value;
  };
  const cleanSession = () => {
    sessionID.value = undefined;
  };
  const setAppList = (value: AppListItem[]) => {
    appList.value = value;
  };
  const clearAppList = () => {
    appList.value = undefined;
  };
  return {
    sessionID,
    appList,
    setSession,
    cleanSession,
    setAppList,
    clearAppList
  };
});
