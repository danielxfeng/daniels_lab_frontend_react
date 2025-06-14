import { AxiosResponse } from 'axios';

/**
 * @summary An helper class to throw a Response error.
 */
class HttpResponseError extends Error {
  status: number;
  statusText: string;

  constructor(status: number, message: string, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.name = 'HttpResponseError';
  }
}

/**
 * @summary A type guard to check if an error is an instance of HttpResponseError.
 * @param error the error to be checked
 * @returns true if the error is an instance of HttpResponseError, false otherwise
 */
const isHttpResponseError = (error: unknown): error is HttpResponseError => {
  return error instanceof HttpResponseError;
};

/**
 * @summary An helper function to throw a Response error.
 * @param status the status code to be thrown
 * @param message the error message to be thrown
 * @param statusText the status text to be thrown
 * @throw Response error
 */
const throwWithErr = (status: number, message: string, statusText: string): never => {
  throw new HttpResponseError(status, message, statusText);
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
 * @summary An helper function to throw a Response error for debounced requests.
 * @param message the error message to be thrown
 * @returns Response error with status 429
 */
const throwDebouncedErr = (message: string): never => {
  return throwWithErr(429, `Too many requests: ${message}`, 'Too Many Requests');
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

/**
 * @summary An helper function to throw a Response error.
 * @param message the error message to be thrown
 * @param err the error from the validation
 * @throw Response error
 */
const throwWithUserValidationErr = (message: string, err: string): never => {
  return throwWithErr(400, `Failed to ${message}: ${err}`, 'Bad Request');
};

export {
  HttpResponseError,
  isHttpResponseError,
  throwDebouncedErr,
  throwWithAxiosErr,
  throwWithErr,
  throwWithUserValidationErr,
  throwWithValidationErr,
};
