import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { useTradingWorkspace } from './hooks/useTradingWorkspace';

export function App() {
  const workspace = useTradingWorkspace();

  return (
    <BrowserRouter>
      <AppRoutes workspace={workspace} />
    </BrowserRouter>
  );
}

export default App;
