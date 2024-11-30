import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalContent, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { empresaService } from '../../../services/EmpresaService';
import { columns } from './adicionales/datos';
import { SearchIcon } from '../../../../public/Icons/SearchIcon';
import { ChevronDownIcon } from '../../../../public/Icons/ChevronDownIcon';
import Texto from '../../../componentes/Texto';
import { capitalize } from '../../../adicionales/utils';
import { VerticalDotsIcon } from '../../../../public/Icons/VerticalDotsIcon';
import InfoEmpresa from './InfoEmpresa';
import EditarEmpresa from './EditarEmpresa';

export default function ListadoEmpresa() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const INITIAL_VISIBLE_COLUMNS = [
    "id_empresa",
    "nombre",
    "ruc",
    "website",
    "acciones",
  ];
  const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5); // Tamaño de página
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "id_empresa",
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const fetchEmpresas = async () => {
    try {
      const data = await empresaService.listarEmpresas();
      setEmpresas(data);
    } catch (error) {
      console.error("Error al obtener empresas:", error);
    }
  };
  useEffect(() => {
    fetchEmpresas();
  }, []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredEmpresas = [...empresas];

    if (hasSearchFilter) {
      filteredEmpresas = filteredEmpresas.filter((empresa) =>
        empresa.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    /*
    // Filtrado por estado (Disponible/Agotado)
    if (statusFilter !== "all" && statusFilter.size > 0) {
      const selectedStatuses = Array.from(statusFilter).map((key) =>
        Number(key)
      ); // Convertir a número
      filteredEmpresas = filteredEmpresas.filter((empresa) =>
        selectedStatuses.includes(Number(empresa.estado_cantidad))
      );
    }
*/
    return filteredEmpresas;
  }, [empresas, filterValue, statusFilter]);

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

  const renderCell = useCallback((empresa, columnKey) => {
    const cellValue = empresa[columnKey];

    switch (columnKey) {
      case "nombre":
        return <span>{empresa.nombre}</span>;
      case "ruc":
        return <span>{empresa.ruc}</span>;
      case "website":
        return <span>{empresa.website}</span>;


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
                <DropdownItem onPress={() => openModal(empresa.id_empresa, "view")}>Ver</DropdownItem>
                <DropdownItem onPress={() => openModal(empresa.id_empresa, "edit")}>Editar</DropdownItem>
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

  const openModal = (empresaId, action) => {
    setSelectedEmpresaId(empresaId);
    setModalAction(action);
    onOpen(); 
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
            Total {empresas.length} Empresas
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
    empresas.length,
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
            isDisabled={page === 1} 
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={page === pages} 
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [page, pages]); 
  return (
    <>
      <Texto titulo texto={"Listado de Empresas"} />
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
        <TableBody emptyContent={"No hay empresas"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id_empresa}>
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
                return <InfoEmpresa onClose={onClose} empresaId={selectedEmpresaId} />;

              case "edit":
                return <EditarEmpresa onClose={onClose} empresaId={selectedEmpresaId} />;
              default:
                return null;
            }
          }}
        </ModalContent>
      </Modal>
    </>
  )
}
