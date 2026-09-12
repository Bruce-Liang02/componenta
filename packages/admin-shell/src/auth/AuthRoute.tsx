/**
 * 受保护的路由包装：未登录跳转到 /login
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@componenta/core';

export interface AuthRouteProps {
  children: React.ReactNode;
}

export function AuthRoute({ children }: AuthRouteProps) {
  const currentUser = useAppStore((s) => s.currentUser);
  const location = useLocation();
  const token = localStorage.getItem('componenta:token');

  if (!currentUser && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

AuthRoute.displayName = 'AuthRoute';

export default AuthRoute;
