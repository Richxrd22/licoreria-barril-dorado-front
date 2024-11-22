import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useFormulario } from '../context/FormularioContext';

export default function PrivateRoute({ formType }) {
  const { formStatus } = useFormulario();

  // Si el formulario correspondiente no ha sido enviado, redirecciona
  if (!formStatus[formType]) {
    return <Navigate to="/admin" replace />;
  }

  // Si fue enviado, renderiza el componente hijo usando `Outlet`
  return <Outlet />;
}