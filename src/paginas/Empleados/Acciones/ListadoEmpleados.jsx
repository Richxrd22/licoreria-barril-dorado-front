import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalContent, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import InfoEmpleado from '././InfoEmpleado';
import Texto from "../../../componentes/Texto";
import { capitalize } from "../../../adicionales/utils";
import { columns, statusOptions } from "./adicionales/datos";
import { VerticalDotsIcon } from "../../../../public/Icons/VerticalDotsIcon";
import { SearchIcon } from "../../../../public/Icons/SearchIcon";
import { ChevronDownIcon } from "../../../../public/Icons/ChevronDownIcon";
import { empleadoService } from "../../../services/EmpleadoService";
import EditarEmpleado from './EditarEmpleado';
import GestionUsuario from './GestionUsuario';
export default function ListadoEmpleados() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const INITIAL_VISIBLE_COLUMNS = [
    "nombre",
    "apellido",
    "dni",
    "correo_personal",
    "correo_empresarial",
    "activo",
    "acciones",
  ];

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5); // Tamaño de página
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "id_empleado",
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const fetchEmpleados = async () => {
    try {
      const data = await empleadoService.listarEmpleado();
      setEmpleados(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredEmployee = [...empleados];

    // Filtrado por nombre
    if (hasSearchFilter) {
      filteredEmployee = filteredEmployee.filter((employee) =>
        employee.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Filtrado por estado (Disponible/Agotado)
    if (statusFilter !== "all" && statusFilter.size > 0) {
      const selectedStatuses = Array.from(statusFilter).map((key) =>
        Number(key)
      ); // Convertir a número
      filteredEmployee = filteredEmployee.filter((employee) =>
        selectedStatuses.includes(Number(employee.activo))
      );
    }

    return filteredEmployee;
  }, [empleados, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);


  const cambiarEstadoEmpleado = async (idEmpleado, estadoActual) => {
    try {
      // Hacemos una solicitud GET para obtener los datos del empleado (si no los tienes en el frontend)
      const empleadoResponse = await empleadoService.obtenerEmpleadoId(idEmpleado);
      const empleadoData = empleadoResponse;

      console.log(empleadoResponse)
      // Determinamos el nuevo estado (si está en 1, lo cambiamos a 0 y viceversa)
      const nuevoEstado = estadoActual === true ? false : true;

      // Creamos el objeto de datos para actualizar
      const empleadoActualizar = {
        id_empleado: idEmpleado,
        nombre: empleadoData.nombre,
        apellido: empleadoData.apellido,
        dni: empleadoData.dni,
        correo: empleadoData.correo_personal,
        telefono: empleadoData.telefono,
        direccion: empleadoData.direccion,
        activo: nuevoEstado, // Solo cambiamos el estado
      };

      // Llamamos al servicio para actualizar el empleado con el nuevo estado
      await empleadoService.editarEmpleado(empleadoActualizar);

      setEmpleados((prevEmpleados) =>
        prevEmpleados.map((empleado) =>
          empleado.id_empleado === idEmpleado
            ? { ...empleado, activo: nuevoEstado }  // Actualizamos solo el estado
            : empleado
        )
      );
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };



  const renderCell = useCallback((employee, columnKey) => {
    const cellValue = employee[columnKey];

    switch (columnKey) {
      case "nombre":
        return <span>{employee.nombre}</span>;
      case "apellido":
        return <span>{employee.apellido}</span>;
      case "dni":
        return <span>{employee.dni}</span>;

      case "correo_personal":
        return <span>{employee.correo_personal}</span>;
      case "correo_empresarial":
        return <span>{employee.correo_empresarial}</span>;
      case "telefono":
        return <span>{employee.telefono}</span>;

      case "activo":
        return (
          <Chip
            className="capitalize"
            size="sm"
            variant="flat"
            color={employee.activo ? "success" : "danger"}
          >
            {employee.activo === true ? "Activo" : "Inactivo"}
          </Chip>
        );
      case "nombre_rol":
        return <span>{employee.nombre_rol}</span>;
      case "acciones":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onPress={() => openModal(employee.id_empleado, "view")}>Ver</DropdownItem>
                <DropdownItem onPress={() => openModal(employee.id_empleado, "usuario")}>Gestion Usuario</DropdownItem>
                <DropdownItem onPress={() => cambiarEstadoEmpleado(employee.id_empleado, employee.activo)}>
                  Cambiar Estado
                </DropdownItem>
                <DropdownItem onPress={() => openModal(employee.id_empleado, "edit")}>Editar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);


  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);


  const openModal = (employeeId, action) => {
    setSelectedEmployeeId(employeeId);
    setModalAction(action);
    onOpen(); // Abre el modal
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtrar por estado"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setStatusFilter(new Set([...keys]))
                }
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {empleados.length} Empleados
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    empleados.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={page === 1} // Cambié `pages === 1` a `page === 1`
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={page === pages} // Cambié `pages === 1` a `page === pages`
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [page, pages]); // Solo dependencias relevantes
  return (
    <>
      <Texto titulo texto={"Listado de Empleados"} />
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "acciones" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No hay Empleados"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id_empleado}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal size={modalAction === "edit" && "2xl"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent >
          {(onClose) => {
            switch (modalAction) {
              case "view":
                return <InfoEmpleado onClose={onClose} employeeId={selectedEmployeeId} />;
              case "usuario":
                return <GestionUsuario onClose={onClose} employeeId={selectedEmployeeId} />;
              case "edit":
                return <EditarEmpleado onClose={onClose} employeeId={selectedEmployeeId} />;
              default:
                return null;
            }
          }}
        </ModalContent>
      </Modal>
    </>
  )
}
