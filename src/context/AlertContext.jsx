import React, { createContext, useState, useContext } from 'react';
import { useDisclosure } from '@nextui-org/react';

const AlertContext = createContext();
export const AlertProvider = ({ children }) => {
    const [alertas, setAlertas] = useState([]); 
    const [modalContent, setModalContent] = useState(''); 
    const { isOpen, onOpen, onClose } = useDisclosure(); 

    const agregarAlerta = (nuevaAlerta) => {
        setAlertas((prevAlertas) => [...prevAlertas, nuevaAlerta]);
        setModalContent(nuevaAlerta);
        onOpen(); 
    };

    const cerrarModal = () => {
        setAlertas([]); 
        onClose();
    };

    return (
        <AlertContext.Provider value={{ alertas, agregarAlerta, cerrarModal, isOpen, modalContent }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlertas = () => {
    return useContext(AlertContext);
};
