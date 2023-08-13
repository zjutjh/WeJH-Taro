import type { Information } from "@/types/Information";

export interface InformationStoreType {
  informationList: Information[];
  updateCounter: number;
}

export const InformationStore = {
  state: () => ({
    informationList: [],
    updateCounter: 0
  }),
  mutations: {
    setInformationList(
      state: InformationStoreType,
      value: Information[]
    ) {
      if (state.informationList.length != value.length)
        state.updateCounter = Math.abs(
          value.length - state.informationList.length
        );
      state.informationList = value;
    },
    clearAnnouncementsUpdateCounter(state: InformationStoreType) {
      state.updateCounter = 0;
    }
  }
};
