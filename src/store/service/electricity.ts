export const ElectricityServiceStore = {
  state: () => ({
    balance: undefined,
    updateTime: {
      balance: undefined,
    },
  }),
  mutations: {
    setBalance(state: any,value) {
      state.balance = value;
      state.updateTime.balance = new Date();
    }
  }
};
