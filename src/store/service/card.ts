import { CardConsume } from "@/types/CardConsume";

export interface CardServiceType {
  balance?: number;
  today: CardConsume[];
  updateTime: {
    today?: Date;
    balance?: Date;
  };
}
export const CardServiceStore = {
  state: () => ({
    balance: 0,
    history: [],
    today: [],
    updateTime: {
      balance: undefined,
      history: undefined,
      today: undefined
    }
  }),

  mutations: {
    setCardBalance(state: CardServiceType, value: number) {
      state.balance = value;
      state.updateTime.balance = new Date();
    },
    setCardToday(state: CardServiceType, value: CardConsume[]) {
      if (value !== null) state.today = value;
      else state.today = [];
      state.updateTime.today = new Date();
    },
    clearCardToday(state: CardServiceType) {
      state.today = [];
    }
  }
};
