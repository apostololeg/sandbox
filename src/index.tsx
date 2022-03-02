import 'react-hot-loader';
import ReactDOM from 'react-dom';

import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import App from 'components/App/App';

if (PRODUCTION) {
  import('./pwa');
  // import('@sentry/react').then(Sentry => Sentry.init({ dsn: SENTRY_DSN }));
}

ReactDOM.render(<App />, document.getElementById('app-root'));
