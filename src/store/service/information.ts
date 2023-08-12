import type { Information } from "@/types/Information";

export interface InformationStoreType {
  informationList: Information[];
}

export const InformationStore = {
  state: () => ({
    informationList: [],
  }),
  mutations: {
    setInformationList(
      state: InformationStoreType,
      value: Information[]
    ) {
      state.informationList = value;
    }
  }
};
