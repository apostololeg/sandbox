import './lib/analytics';

import App from './components/ErrorBoundary/App/App';
import { createRoot } from 'react-dom/client';

if (PRODUCTION) {
  import('pwa');
}

const elem = document.getElementById('app-root') as HTMLElement;
const root = createRoot(elem);

root.render(<App />);
