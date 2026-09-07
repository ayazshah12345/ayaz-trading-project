import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { useTradingWorkspace } from './hooks/useTradingWorkspace';
import { PWAInstallBanner } from './components/PWAInstallBanner';

export function App() {
  const workspace = useTradingWorkspace();

  return (
    <BrowserRouter>
      <AppRoutes workspace={workspace} />
      {/* PWA install prompt banner — appears when browser offers installation */}
      <PWAInstallBanner />
    </BrowserRouter>
  );
}

export default App;
