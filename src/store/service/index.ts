import { AppListItem } from "@/types/AppList";
import { BorrowBooksInfo } from "@/types/BorrowBooksInfo";

import { AnnouncementStore, AnnouncementType } from "./announcement";
import { CardServiceStore, CardServiceType } from "./card";
import { ElectricityServiceStore } from "./electricity";
import { HomeCardServiceStore, HomeCardServiceType } from "./homecard";
import { InformationStore, InformationStoreType } from "./information";
import { LibraryServiceStore } from "./library";
import { LostfoundStore, LostfoundStoreType } from "./lostfound";
import { NotificationStore, NotificationStoreType } from "./notification";
import { ScoreServiceStore } from "./score";
import { SuitStore, SuitStoreType } from "./suit";
import { ThemeStore, ThemeStoreType } from "./theme";
import { UserServiceStore, UserType } from "./user";
import { WebviewStore, WebviewStoreType } from "./webview";
import { ZFServiceStore, ZFServiceType } from "./zf";

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
    electricityCampus: string;
    selectIndex: number;
    lastCampus: string;
    todayConsumption: string;
    updateTime: {
      balance: Date;
    };
  };
  score: {
    readScoreMarks: Array<{
      name: string;
      scorePoint: string;
      val: boolean;
    }>;
    unCalScore: Array<{
      name: string;
      scorePoint: string;
      key: string;
    }>;
    findNewScoresTime: Date;
    scorePeriod: "期中" | "期末";
  };
  library: {
    history: BorrowBooksInfo[];
    current: BorrowBooksInfo[];
    updateTime: { history: string; current: string };
  };
  zf: ZFServiceType;
  lostfound: LostfoundStoreType;
  homecard: HomeCardServiceType;
  notification: NotificationStoreType;
  theme: ThemeStoreType;
  suit: SuitStoreType;
}

export const ServiceStore = {
  modules: {
    card: CardServiceStore,
    user: UserServiceStore,
    webview: WebviewStore,
    library: LibraryServiceStore,
    zf: ZFServiceStore,
    announcement: AnnouncementStore,
    information: InformationStore,
    score: ScoreServiceStore,
    homecard: HomeCardServiceStore,
    electricity: ElectricityServiceStore,
    lostfound: LostfoundStore,
    notification: NotificationStore,
    theme: ThemeStore,
    suit: SuitStore
  },
  state: () => ({
    sessionID: undefined
  }),
  mutations: {
    setSession(state: ServiceStoreType, value) {
      state.sessionID = value;
    },
    clearSession(state: ServiceStoreType) {
      state.sessionID = undefined;
    },
    setApplist(state: ServiceStoreType, value) {
      state.appList = value;
    },
    clearApplist(state: ServiceStoreType) {
      state.appList = undefined;
    }
  }
};
