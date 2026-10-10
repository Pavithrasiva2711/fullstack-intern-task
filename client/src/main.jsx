
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import App from './App.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Favorites from './pages/Favorites.jsx';
import './index.css';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/templates" replace />}
      />

      <Route
        path="/templates"
        element={<App />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/favorites"
        element={<Favorites />}
      />

      <Route
        path="*"
        element={<Navigate to="/templates" replace />}
      />
    </Routes>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);
