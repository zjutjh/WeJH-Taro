import { CardServiceType } from "./card";
import { UserType } from "./user";
import { useZFServiceStore, ZFServiceType } from "./zf";
import { BorrowBooksInfo } from "@/types/BorrowBooksInfo";
import { AnnouncementType } from "./announcement";
import { InformationStoreType } from "./information";
import { AppListItem } from "@/types/AppList";
import { HomeCardServiceType } from "./homecard";
import { WebviewStoreType } from "./webview";
import { LostfoundStoreType } from "./lostfound";
import { NotificationStoreType } from "./notification";
import { ThemeStoreType } from "./theme";
import { SuitStoreType } from "./suit";
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
  const zf = useZFServiceStore();
  const score = useServiceStore();
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
    zf,
    score,
    setSession,
    cleanSession,
    setAppList,
    clearAppList
  };
});
