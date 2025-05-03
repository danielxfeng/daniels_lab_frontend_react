import { useRouteError, Link } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import { isAxiosError } from 'axios';
import React from 'react';

// The error boundary of the app.
// It will catch all errors in the app and show a fallback UI.
const ErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col'>
      <Header isBasic={true} />

      <main className='outer-container flex-grow'>
        <div className='inner-container flex flex-col gap-4'>
          <h1>Oops! Something went wrong.</h1>

          {/** If it's a response error, from React Router? */}
          {error instanceof Response && (
            <>
              <p>Status: {error.status}</p>
              <p>Message: {error.statusText || 'Unknown error'}</p>
            </>
          )}

          {/** If it's a Error */}
          {error instanceof Error && (
            <React.Fragment>
              <p>Message: {error.message}</p>

              {/** If it's an AxiosError */}
              {isAxiosError(error) ? (
                // Handle potential Response error or Request error
                <React.Fragment>
                  {error.response ? (
                    <React.Fragment>
                      <p>Status: {error.response.status}</p>
                      <p>Details: {error.response.data?.message || 'No details'}</p>
                    </React.Fragment>
                  ) : error.request ? (
                    <React.Fragment>
                      <p>Status: Request made but no response received.</p>
                      <p>Details: {error.request.statusText || 'No details'}</p>
                    </React.Fragment>
                  ) : (
                    <p>Unknown Axios error.</p>
                  )}
                </React.Fragment>
              ) : (
                <p>Unknown JS error.</p>
              )}
            </React.Fragment>
          )}

          {/* Fallback for unknown error type */}
          {!(error instanceof Response) && !(error instanceof Error) && (
            <p>Unknown error: {String(error)}</p>
          )}

          {/** Link to go back to home. */}
          <Link to='/'>Go back to home</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ErrorBoundary;
