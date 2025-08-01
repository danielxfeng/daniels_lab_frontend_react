import { isRouteErrorResponse } from 'react-router';
import { isAxiosError } from 'axios';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/header/Header';
import MotionButton from '@/components/motion_components/MotionButton';
import { isHttpResponseError } from '@/lib/throwWithErr';

const ErrorBoundary = ({ error }: { error: unknown }) => {
  return (
    <div className='bg-background text-foreground flex min-h-screen flex-grow flex-col items-center justify-center'>
      <Header isBasic={true} />

      <main className='outer-container flex flex-grow items-center justify-center'>
        <div className='inner-container flex flex-grow flex-col items-center justify-center gap-4'>
          <h1>Oops! Something went wrong.</h1>

          {/* Handle router error */}
          {isRouteErrorResponse(error) && (
            <>
              <p>Status: {error.status === 404 ? '404' : 'Error'}</p>
              <p>
                Message: {error.status === 404 ? 'Not Found' : error.statusText || 'Unknown error'}
              </p>
            </>
          )}

          {/* Handle custom HttpResponseError */}
          {isHttpResponseError(error) && (
            <>
              <p>
                Status: {error.status} {error.statusText}
              </p>
              <p>Message: {error.message || 'Unknown error'}</p>
            </>
          )}

          {/* Handle native JS Errors */}
          {!isHttpResponseError(error) && error instanceof Error && (
            <>
              <p>Message: {error.message}</p>

              {/* Axios-specific error handling */}
              {isAxiosError(error) ? (
                <>
                  {error.response ? (
                    <>
                      <p>Status: {error.response.status}</p>
                      <p>Details: {error.response.data?.message || 'No details'}</p>
                    </>
                  ) : error.request ? (
                    <>
                      <p>Status: Request made but no response received.</p>
                      <p>Details: {error.request.statusText || 'No details'}</p>
                    </>
                  ) : (
                    <p>Unknown Axios error.</p>
                  )}
                </>
              ) : (
                <p>Unknown JS error.</p>
              )}
            </>
          )}

          {/* Fallback for unknown errors */}
          {!isHttpResponseError(error) && !(error instanceof Error) && (
            <p>Unknown error: {JSON.stringify(error)}</p>
          )}

          <MotionButton
            to='/'
            supportingText='home'
            text='home'
            variant='highlight'
            isExternal={false}
            size='md'
            dataRole='button-home'
            isFullWidth={false}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ErrorBoundary;
