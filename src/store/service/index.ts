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
