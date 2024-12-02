import React, { useEffect, useState } from 'react';
import { useProductos } from '../../hook/useProductos'; 
import { useAlertas } from '../../context/AlertContext';
import { Modal, Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { useDecodedToken } from '../../hook/useDecodedToken';

export default function AlertaProducto() {
    const { productos } = useProductos(); 
    const { agregarAlerta, modalContent, cerrarModal, isOpen } = useAlertas();
    const { baseRoute } = useDecodedToken();
    const [alertasMostradas, setAlertasMostradas] = useState({
        vencimiento: false,
        bajoStock: false
    });

    useEffect(() => {
        const currentDate = new Date(); 
        let productosPorVencer = 0;
        let productosBajoStock = 0;

        if (productos && Array.isArray(productos)) {
            productos.forEach((producto) => {
                if (producto.fecha_vencimiento && producto.cantidad !== undefined) {
                    const fechaVencimiento = new Date(producto.fecha_vencimiento);
                    const diffMilliseconds = fechaVencimiento - currentDate;

                    const diffDays = Math.floor(diffMilliseconds / (1000 * 3600 * 24));
                    if (diffDays <= 15 ) {
                        productosPorVencer += 1;
                    }

                    if (producto.cantidad <= 15 && producto.estado_cantidad) {
                        productosBajoStock += 1;
                    }
                }
            });

            let mensajeAlerta = '';
            if (productosPorVencer > 0 && productosBajoStock > 0) {
                mensajeAlerta = `Hay productos con bajo stock y que están por vencer.`;
            } else if (productosPorVencer > 0) {
                mensajeAlerta = `Hay productos que están por vencer en los próximos 15 días.`;
            } else if (productosBajoStock > 0) {
                mensajeAlerta = `Hay productos con bajo stock.`;
            }

            if (mensajeAlerta && !alertasMostradas.vencimiento && !alertasMostradas.bajoStock) {
                agregarAlerta(mensajeAlerta.trim());
                setAlertasMostradas({ vencimiento: true, bajoStock: true });
            }
        }
    }, [productos, agregarAlerta, alertasMostradas]); 

    return (
        <Modal isOpen={isOpen} onClose={cerrarModal}>
            <ModalContent>
                <ModalHeader>Alerta de productos</ModalHeader>
                <ModalBody>
                    <ul>
                        <li className='text-center'>{modalContent}</li>
                    </ul>
                </ModalBody>
                <ModalFooter className='flex  justify-center '>
                    <Link to={`${baseRoute}/panel`} onClick={cerrarModal} className='z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 text-small gap-2 rounded-medium w-full [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none data-[hover=true]:opacity-hover bg-slate-700 text-white'>Gestionar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
