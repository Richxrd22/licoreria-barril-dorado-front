import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

import ProductoForm from "../../formularios/ProductoForm";
import ListadoProductos from "./Acciones/ListadoProductos";
import { useProductos } from "../../hook/useProductos";
import Texto from "../../componentes/Texto";

export default function Producto() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { productos } =
    useProductos();
  return (
    <div className="flex flex-col py-5 lg:py-10  w-11/12 m-auto gap-4">
      <div>
        <Button
          size={"md"}
          onPress={onOpen}
          startContent={<AddBoxOutlinedIcon />}
        >
          <span>Agregar Producto</span>
        </Button>
      </div>
      <Texto titulo texto={"Listado de Productos"} />
      <ListadoProductos productos={productos} />
      <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar Producto
              </ModalHeader>
              <ModalBody>
                <ProductoForm  onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
