import { HomeCardName } from "@/constants/homeCards";

export interface HomeCardServiceType {
  selected: Array<HomeCardName>
  initialization: Boolean
}
export const HomeCardServiceStore = {
  state: () => ({
    selected: ["lessons-table-quick-view","score-quick-view"],
    initialization: true
  }),

  mutations: {
    addHomeCardItem(state: HomeCardServiceType, value: HomeCardName) {
      state.selected.push(value);
    },
    removeHomeCardItem(state: HomeCardServiceType, value: HomeCardName) {
      const toDelete = state.selected.findIndex(item => item === value);
      toDelete !== -1 && state.selected.splice(toDelete, 1);
    }
  }
};
