import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useFormulario } from '../context/FormularioContext';
import { useDecodedToken } from '../hook/useDecodedToken';

export default function PrivateRoute({ formType }) {
  const { formStatus } = useFormulario();
  const { baseRoute } = useDecodedToken();

  if (!formStatus[formType]) {
    return <Navigate to={`${baseRoute}/panel`} replace />;
  }

  return <Outlet />;
}