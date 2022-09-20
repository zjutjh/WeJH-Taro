import { api } from '../api/apiList';
import { updateDateStateWithSession } from '../utils/updateDateState';

export default class LibraryService {
  static async getLibraryCurrent(): Promise<any> {
    return updateDateStateWithSession(
      api.library.current,
      null,
      'setLibraryCurrent'
    );
  }

  static async getLibraryHistory(): Promise<any> {
    return updateDateStateWithSession(
      api.library.history,
      null,
      'setLibraryHistory'
    );
  }
}
