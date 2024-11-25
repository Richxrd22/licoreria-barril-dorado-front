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
import EmpleadoForm from "../../formularios/EmpleadoForm";
import ListadoEmpleados from "./Acciones/ListadoEmpleados";
export default function Empleados() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="flex flex-col py-5 lg:py-10  w-11/12 m-auto gap-4">
      <div>
        <Button
          size={"md"}
          onPress={onOpen}
          startContent={<AddBoxOutlinedIcon />}
        >
          <span>Agregar Empleado</span>
        </Button>
      </div>

      <ListadoEmpleados />
      <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar Empleado
              </ModalHeader>
              <ModalBody>
                <EmpleadoForm onClose={onClose} />
              </ModalBody>

            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
