'use client';

import { AuthProvider } from './context/AuthContext';

export function ClientLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}