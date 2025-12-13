import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import './index.css';
import { AuthProvider } from './AuthContext';
import { UIProvider } from './UIContext';

import router from "./router";

createRoot(document.getElementById('root')).render(
  <StrictMode>
          <UIProvider>
              <AuthProvider>
                  <RouterProvider router={router} />
              </AuthProvider>
          </UIProvider>
  </StrictMode>,
)
