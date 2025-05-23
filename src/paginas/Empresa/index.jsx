import React from 'react';
import {
  Button, Modal,
  ModalBody,
  ModalContent, ModalHeader, useDisclosure
} from "@nextui-org/react";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import EmpresaForm from '../../formularios/EmpresaForm';
import ListadoEmpresa from './Acciones/ListadoEmpresa';
export default function Empresa() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="flex flex-col py-5 lg:py-10  w-11/12 m-auto gap-4">
      <div>
        <Button
          size={"md"}
          onPress={onOpen}
          startContent={<AddBoxOutlinedIcon />}
        >
          <span>Agregar Empresa</span>
        </Button>
      </div>
      <ListadoEmpresa/>
      <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar Empresa
              </ModalHeader>
              <ModalBody>
                <EmpresaForm onClose={onClose}/>
              </ModalBody>
              
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
