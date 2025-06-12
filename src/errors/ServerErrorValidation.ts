import { TranslatedErrorResponse } from '@/utils/errors/getCommercetoolsErrorMessage';

export class ServerErrorValidation extends Error {
  public response: TranslatedErrorResponse;

  constructor(response: TranslatedErrorResponse) {
    super('Server Validation Error');

    this.response = response;
  }
}
