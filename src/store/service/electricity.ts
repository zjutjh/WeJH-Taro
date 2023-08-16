import { ServiceStoreType } from ".";

export const ElectricityServiceStore = {
  state: () => ({
    roomName: "未知",
    roomCode: "未知",
    balance: undefined,
    todayConsumption: undefined,
    updateTime: {
      balance: undefined,
    },
  }),
  mutations: {
    setElectricityStore(
      state: ServiceStoreType["electricity"],
      value: Partial<ServiceStoreType["electricity"]>
    ) {
      value.roomName !== undefined && (state.roomName = value.roomName);
      value.roomCode !== undefined && (state.roomCode = value.roomCode);
      value.balance !== undefined && (state.balance = value.balance);
      state.updateTime.balance = new Date();
    },
    setBalance(state: ServiceStoreType["electricity"], value: number) {
      state.balance = value;
      state.updateTime.balance = new Date();
    },
    setConsumption(state: ServiceStoreType["electricity"], value: string) {
      state.todayConsumption = value;
    }
  }
};
