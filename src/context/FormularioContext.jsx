import React, { createContext, useState, useContext } from 'react';
const FormularioContext = createContext();
export function useFormulario() {
  return useContext(FormularioContext);
}
export function FormularioProvider({ children }) {
  const [formStatus, setFormStatus] = useState({
    producto: false,
    categoria: false,
    proveedor: false,
    empresa: false,
  });

  const markFormAsSubmitted = (formType) => {
    setFormStatus(prevState => ({
      ...prevState,
      [formType]: true,
    }));
  };

  return (
    <FormularioContext.Provider value={{ formStatus, markFormAsSubmitted }}>
      {children}
    </FormularioContext.Provider>
  );
}