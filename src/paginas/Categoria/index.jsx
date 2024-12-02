import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import React from 'react'
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ListadoCategoria from './Acciones/ListadoCategoria';
import CategoriaForm from '../../formularios/CategoriaForm';
export default function Categoria() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <div className="flex flex-col py-5 lg:py-10  w-11/12 m-auto gap-4">
            <div>
                <Button
                    size={"md"}
                    onPress={onOpen}
                    startContent={<AddBoxOutlinedIcon />}
                >
                    <span>Agregar Categoria</span>
                </Button>
            </div>
            <ListadoCategoria />
            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Registrar Categoria
                            </ModalHeader>
                            <ModalBody>
                                <CategoriaForm onClose={onClose}/>
                            </ModalBody>

                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}
