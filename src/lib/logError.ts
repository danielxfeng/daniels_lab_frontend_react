import * as Sentry from '@sentry/react';

const logError = (error: unknown, context?: string) => {
  const message = context ? `[${context}]` : '';

  if (import.meta.env.PROD) {
    Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
      extra: { context },
    });
  } else console.error(message, error);
};

export default logError;
