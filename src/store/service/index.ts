import { CardServiceStore, CardServiceType } from "./card";
import { UserType, UserServiceStore } from "./user";
import { LibraryServiceStore } from "./library";
import { ZFServiceStore, ZFServiceType } from "./zf";
import { BorrowBooksInfo } from "@/types/BorrowBooksInfo";
import { AnnouncementStore, AnnouncementType } from "./announcement";
import { AppListItem } from "@/types/AppList";
import { CanteenServiceStore } from "./canteen";
import { ScoreServiceStore } from "./score";
import { HomeCardServiceStore, HomeCardServiceType } from "./homecard";
import { ElectricityServiceStore } from "./electricity";

export interface ServiceStoreType {
  appList?: AppListItem[];
  card: CardServiceType;
  user: UserType;
  sessionID?: string;
  schoolBus: {};
  announcement: AnnouncementType;
  canteen: {
    flow: any;
    updateTime: {
      flow: string;
    };
  };
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
  }
  library: {
    history: BorrowBooksInfo[];
    current: BorrowBooksInfo[];
    updateTime: { history: string; current: string };
  };
  zf: ZFServiceType;
  homecard: HomeCardServiceType;
}

export const ServiceStore = {
  modules: {
    card: CardServiceStore,
    user: UserServiceStore,
    library: LibraryServiceStore,
    zf: ZFServiceStore,
    announcement: AnnouncementStore,
    canteen: CanteenServiceStore,
    score: ScoreServiceStore,
    homecard: HomeCardServiceStore,
    electricity: ElectricityServiceStore,
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
