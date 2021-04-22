export const ServiceStore = {
  state: () => ({
    sessionID: undefined,
    user: undefined,
    applist: undefined,
    card: {
      balance: 0,
      history: [],
      today: [],
    },
  }),
  mutations: {
    setCardBalance(state: any, value: number) {
      state.card.balance = value;
    },
    setCardHistory(state: any, value: Array<object>) {
      state.card.history = value;
    },
    setCardToday(state: any, value: Array<object>) {
      state.card.today = value;
    },

    setSession(state: any, value) {
      state.sessionID = value;
    },
    clearSession(state) {
      state.sessionID = undefined;
    },

    setUser(state: any, value) {
      state.user = value;
    },
    clearUser(state) {
      state.user = undefined;
    },

    setApplist(state: any, value) {
      state.applist = value;
    },
    clearApplist(state) {
      state.applist = undefined;
    },
  },
};
