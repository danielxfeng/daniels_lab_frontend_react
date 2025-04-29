import { useRouteError, Link } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';

// The error boundary of the app.
// It will catch all errors in the app and show a fallback UI.
const ErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />

      <main className='container mx-auto flex-grow px-4 py-8 text-center'>
        <h1>Oops! Something went wrong.</h1>

        {/** If it's a response error. */}
        {error instanceof Response && (
          <>
            <p>Status: {error.status}</p>
            <p>Message: {error.statusText || 'Unknown error'}</p>
          </>
        )}

        {/** If it's a Error. */}
        {error instanceof Error && <p>Message: {(error as Error).message}</p>}

        {/** Fallback. */}
        {!(error instanceof Response) && !(error instanceof Error) && (
          <p>Unknown error: {String(error)}</p>
        )}

        {/** Link to go back to home. */}
        <Link to='/'>Go back to home</Link>
      </main>

      <Footer />
    </div>
  );
};

export default ErrorBoundary;
