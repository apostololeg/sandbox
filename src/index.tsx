import { createRoot } from 'react-dom/client';

import App from './components/App/App';

if (PRODUCTION) {
  import('pwa');
}

const elem = document.getElementById('app-root') as HTMLElement;
const root = createRoot(elem);

root.render(<App />);
