import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import RouterPool from './app/RouterPool.tsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/app/store.ts';
import { Toaster } from 'sonner';
import './App.css';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={RouterPool} />
      <Toaster
        position="top-right"
        duration={4000}
        closeButton
        richColors
        expand
      />
    </PersistGate>
  </Provider>
);
