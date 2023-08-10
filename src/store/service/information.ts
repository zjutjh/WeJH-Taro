import type { Information } from "@/types/Information";

export interface InformationStoreType {
  informationList: Information[];
  information: Information;
}

export const InformationStore = {
  state: () => ({
    informationList: [],
    information: {}
  }),
  mutations: {
    setInformationList(
      state: InformationStoreType,
      value: Information[]
    ) {
      state.informationList = value;
    },
    setInformation(
      state: InformationStoreType,
      value: {
        information: Information;
      }
    ) {
      state.information = value.information;
    },
    clearInformation(
      state: InformationStoreType
    ) {
      state.information = {
        id: 0,
        title: "",
        content: "",
        publisher: "",
        publish_time: "",
        img1: "",
        img2: "",
        img3: "",
        end_time: "",
        link: ""
      };
    }
  }
};
