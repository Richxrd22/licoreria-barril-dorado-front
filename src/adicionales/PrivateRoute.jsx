import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useFormulario } from '../context/FormularioContext';

export default function PrivateRoute({ formType }) {
  const { formStatus } = useFormulario();

  if (!formStatus[formType]) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}