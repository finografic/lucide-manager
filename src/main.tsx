import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TooltipProvider } from 'ui/tooltip';

import { App } from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('No #root element');

createRoot(root).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>,
);
