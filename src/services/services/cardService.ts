import { serviceStore } from '@/store';
import { FetchResult } from '@/utils/fetch';
import { api } from '../api/apiList';
import { updateDateStateWithSession } from '../utils/updateDateState';

export default class CardService {
  static async updateCardBalance(): Promise<any> {
    return updateDateStateWithSession(
      api.card.balance,
      null,
      'setCardBalance',
      (res: FetchResult) => res.data.data.balance
    );
  }

  static async updateCardHistory(data?: {
    year: number;
    month: number;
  }): Promise<any> {
    return updateDateStateWithSession(
      api.card.history,
      data,
      'setCardHistory',
      (res: FetchResult) => {
        return {
          data: res.data.data,
          year: data?.year,
          month: data?.month
        };
      }
    );
  }
  static getCardHistory(data: { year: number; month: number }): any {
    if (!serviceStore?.card[data.year]) return { data: [], updateTime: null };
    return serviceStore?.card[data.year][data.month];
  }
  static async updateCardToday(): Promise<any> {
    return updateDateStateWithSession(api.card.today, null, 'setCardToday');
  }
}
