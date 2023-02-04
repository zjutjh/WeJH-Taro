export const ElectricityServiceStore = {
  state: () => ({
    balance: undefined,
    todayConsumption: undefined,
    updateTime: {
      balance: undefined,
    },
  }),
  mutations: {
    setBalance(state: any,value) {
      state.balance = value;
      state.updateTime.balance = new Date();
    },
    setConsumption(state: any,value) {
      state.todayConsumption = value;
    }
  }
};
