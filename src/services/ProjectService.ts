import { commerceToolsAPI } from '../api/commercetools-api';

export default class ProjectService {
  static getProject() {
    return commerceToolsAPI.get().execute();
  }
}
