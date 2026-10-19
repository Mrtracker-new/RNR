import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

/* Prerendered HTML ships Helmet's tags for crawlers. React 19 hoists metadata
   itself and cannot reconcile tags it did not create, so hand ownership over by
   clearing the prerendered copies once, before the first render. */
document.head.querySelectorAll('[data-rh]').forEach(tag => tag.remove());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ErrorBoundary>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ErrorBoundary>
);
