import { AxiosResponse } from 'axios';

/**
 * @summary An helper function to throw a Response error.
 * @param status the status code to be thrown
 * @param message the error message to be thrown
 * @param statusText the status text to be thrown
 * @throw Response error
 */
const throwWithErr = (status: number, message: string, statusText: string): never => {
  throw new Response(message, {
    status,
    statusText,
  });
};

/**
 * @summary An helper function to throw a Response error.
 * @param message the error message to be thrown
 * @param response The Axios response object
 * @throw Response error
 */
const throwWithAxiosErr = (message: string, response: AxiosResponse): never => {
  const apiMessage = response.data?.message || '';
  return throwWithErr(
    500,
    `Failed to ${message}: ${response.status} ${response.statusText}${apiMessage ? ' - ' + apiMessage : ''}`,
    'Internal Server Error',
  );
};

/**
 * @summary An helper function to throw a Response error.
 * @param message the error message to be thrown
 * @param err the error from the validation
 * @throw Response error
 */
const throwWithValidationErr = (message: string, err: string): never => {
  return throwWithErr(500, `Failed to ${message}: ${err}`, 'Internal Server Error');
};

export { throwWithErr, throwWithAxiosErr, throwWithValidationErr };
