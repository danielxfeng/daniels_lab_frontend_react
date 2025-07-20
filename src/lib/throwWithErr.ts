import { AxiosResponse } from 'axios';
import { ZodError } from 'zod';

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

const isHttpResponseError = (error: unknown): error is HttpResponseError => {
  return error instanceof HttpResponseError;
};

const throwWithErr = (status: number, message: string, statusText: string): never => {
  throw new HttpResponseError(status, message, statusText);
};

const throwWithAxiosErr = (message: string, response: AxiosResponse): never => {
  const apiMessage = response.data?.message || '';
  return throwWithErr(
    500,
    `Failed to ${message}: ${response.status} ${response.statusText}${apiMessage ? ' - ' + apiMessage : ''}`,
    'Internal Server Error',
  );
};

const throwDebouncedErr = (message: string): never => {
  return throwWithErr(429, `Too many requests: ${message}`, 'Too Many Requests');
};

const formatZodError = (err: ZodError<unknown>): string => {
  return err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' | ');
};

const throwWithValidationErr = (message: string, err: ZodError<unknown>): never => {
  return throwWithErr(500, `Failed to ${message}: ${formatZodError(err)}`, 'Internal Server Error');
};

const throwWithUserValidationErr = (message: string, err: ZodError<unknown>): never => {
  return throwWithErr(400, `Failed to ${message}: ${formatZodError(err)}`, 'Bad Request');
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
