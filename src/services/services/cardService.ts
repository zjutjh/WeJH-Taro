import { api } from '../api/apiList';
import { updateDateStateWithSession } from '../utils/updateDateState';

export default class CardService {
	static async getCardBalance(): Promise<any> {
		return updateDateStateWithSession(api.card.balance, null, 'setCardBalance', null, (res) => res.data.data.balance);
	}

	static async getCardHistory(data?: { year: number; month: number }): Promise<any> {
		return updateDateStateWithSession(api.card.history, data, 'setCardHistory', 'clearCardHistory');
	}

	static async getCardToday(): Promise<any> {
		return updateDateStateWithSession(api.card.today, null, 'setCardToday', 'clearCardToday');
	}
}
