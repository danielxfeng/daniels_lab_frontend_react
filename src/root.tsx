import { Suspense } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from 'react-router';
import { isAxiosError } from 'axios';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/header/Header';
import MotionButton from '@/components/motion_components/MotionButton';
import Loading from '@/components/shared/Loading';
import ToasterWithTheme from '@/components/shared/ToasterWithTheme';
import { TooltipProvider } from '@/components/ui/tooltip';
import useTheme from '@/hooks/useTheme';
import { isHttpResponseError } from '@/lib/throwWithErr';

import { Route } from '.react-router/types/src/+types/root';

import '@/index.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <link rel='icon' type='image/png' href='/favicon-96x96.png' sizes='96x96' />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />

        <Meta />
        <Links />

        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Space+Grotesk:wght@300..700&display=swap'
          rel='stylesheet'
        />
        <script
          defer
          src='https://stats.danielslab.dev/script.js'
          data-website-id='0dcc26fb-c5b3-42f4-a041-875c1e64bd9c'
        ></script>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

const Root = () => {
  useTheme(); // theme toggle

  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col'>
      <Header />
      <main className='outer-container flex flex-grow flex-col'>
        <Suspense fallback={<Loading />}>
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
        </Suspense>
      </main>
      {/* Footer */}
      <Footer />
      <ToasterWithTheme />
    </div>
  );
};

const ErrorBoundary = ({ error: err }: Route.ErrorBoundaryProps) => {
  const hookError = useRouteError();
  const error = hookError || err;
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
          {!isRouteErrorResponse(error) &&
            !isHttpResponseError(error) &&
            !(error instanceof Error) && <p>Unknown error: {JSON.stringify(error)}</p>}

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

const HydrateFallback = () => {
  return <Loading />;
};

export default Root;
export { ErrorBoundary, HydrateFallback, Layout };
