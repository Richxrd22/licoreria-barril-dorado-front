import React from 'react'
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
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Texto from "../../componentes/Texto";
import EmpresaForm from '../../formularios/EmpresaForm';
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
      <div className="flex gap-10 flex-wrap py-5">
        <div>
          <h2 className="pb-3">Buscar Empresa </h2>
          <div className="flex gap-4">
            <Input
              label="Buscar"
              radius="lg"
              className="lg:min-w-64"
              placeholder="Escribe para buscar..."
              size="sm"
            />
            <Button className="h-auto min-w-7">
              <SearchOutlinedIcon />
            </Button>
          </div>
        </div>
      </div>
      <Texto titulo texto={"Listado de Empresas"} />
      <Table aria-label="Example static collection table" className=" pt-5">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>Tony Reichert</TableCell>
            <TableCell>CEO</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>Zoey Lang</TableCell>
            <TableCell>Technical Lead</TableCell>
            <TableCell>Paused</TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell>Jane Fisher</TableCell>
            <TableCell>Senior Developer</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell>William Howard</TableCell>
            <TableCell>Community Manager</TableCell>
            <TableCell>Vacation</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar Empresa
              </ModalHeader>
              <ModalBody>
                <EmpresaForm/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
