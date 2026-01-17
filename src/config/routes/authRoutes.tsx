/**
 * Auth route definitions
 */
import { lazy } from 'react';
import { Route } from 'react-router-dom';

const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const AuthConfirm = lazy(() => import('@/pages/AuthConfirm'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const UpdatePassword = lazy(() => import('@/pages/UpdatePassword'));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'));
const PaymentCanceled = lazy(() => import('@/pages/PaymentCanceled'));

export function AuthRoutes(): JSX.Element[] {
  return [
    <Route key="login" path="/login" element={<Login />} />,
    <Route key="register" path="/register" element={<Register />} />,
    <Route key="auth-callback" path="/auth/callback" element={<AuthCallback />} />,
    <Route key="auth-confirm" path="/auth/confirm" element={<AuthConfirm />} />,
    <Route key="reset-password" path="/reset-password" element={<ResetPassword />} />,
    <Route key="update-password" path="/update-password" element={<UpdatePassword />} />,
    <Route key="payment-success" path="/payment-success" element={<PaymentSuccess />} />,
    <Route key="payment-canceled" path="/payment-canceled" element={<PaymentCanceled />} />,
  ];
}
