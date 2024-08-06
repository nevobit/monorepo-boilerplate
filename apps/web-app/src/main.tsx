import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Modal } from '@repo/design-system/web/index.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Modal>
      <App />
    </Modal>
  </React.StrictMode>,
);
