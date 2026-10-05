/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminPropertiesPage } from './pages/AdminPropertiesPage';
import { AdminPropertyFormPage } from './pages/AdminPropertyFormPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/imoveis" element={<PropertiesPage />} />
            <Route path="/imovel/:id" element={<PropertyDetailPage />} />
          </Route>

          {/* Login Administrativo */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas Administrativas Protegidas */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="imoveis" element={<AdminPropertiesPage />} />
            <Route path="imoveis/novo" element={<AdminPropertyFormPage />} />
            <Route path="imoveis/:id/editar" element={<AdminPropertyFormPage />} />
          </Route>

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
