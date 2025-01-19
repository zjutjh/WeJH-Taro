import { ServiceStoreType } from ".";

export const ElectricityServiceStore = {
  state: () => ({
    roomName: "未知",
    roomCode: "未知",
    balance: undefined,
    electricityCampus: "zhpf",
    selectIndex: 0,
    lastCampus: "zhpf",
    todayConsumption: undefined,
    updateTime: {
      balance: undefined
    }
  }),
  mutations: {
    setElectricityStore(
      state: ServiceStoreType["electricity"],
      value: Partial<ServiceStoreType["electricity"]>
    ) {
      if (value.roomName !== undefined) state.roomName = value.roomName;
      if (value.roomCode !== undefined) state.roomCode = value.roomCode;
      if (value.balance !== undefined) state.balance = value.balance;
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
