import { api } from '../api/apiList';
import { updateDateStateWithSession } from '../utils/updateDateState';

export default class CanteenService {
	static async getCanteenFlow(): Promise<any> {
		return updateDateStateWithSession(api.canteen.flow, null, 'setCanteenFlow', null);
	}
}
