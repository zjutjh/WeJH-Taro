import store from "../store";
import { serviceStore } from "../store";
import { api } from "./api/apiList";
import { postWithSession } from "./utils/session";
class CardService {
  static async getCardBalance(nocache: boolean = false): Promise<any> {
    let fetchData = nocache;
    if (!serviceStore.card.balance) {
      fetchData = true;
    }
    if (!fetchData) {
      return serviceStore.card.balance;
    }

    let res = await postWithSession(api.card.balance);
    if (res.statusCode === 200 && res.data) {
      store.commit("setCardBalance", res.data.data.balance);
      return serviceStore.card.balance;
    }

    return null;
  }
}

export default CardService;
