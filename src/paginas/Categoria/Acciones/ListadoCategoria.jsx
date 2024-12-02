import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalContent,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDownIcon } from "../../../../public/Icons/ChevronDownIcon";
import { SearchIcon } from "../../../../public/Icons/SearchIcon";
import { VerticalDotsIcon } from "../../../../public/Icons/VerticalDotsIcon";
import { capitalize } from "../../../adicionales/utils";
import Texto from "../../../componentes/Texto";
import { categoriaService } from "../../../services/CategoriaService";
import { columns, statusOptionsActivo } from "./adicionales/datos";
import EditarCategoria from "./EditarCategoria";
import GestionActivo from "./GestionActivo";

export default function ListadoCategoria() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const INITIAL_VISIBLE_COLUMNS = [
    "id_categoria",
    "nombre_categoria",
    "activo",
    "acciones",
  ];
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilterActivo, setStatusFilterActivo] = useState(new Set(["1"]));
  const [rowsPerPage, setRowsPerPage] = useState(5); // Tamaño de página
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "id_categoria",
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const fetchCategorias = async () => {
    try {
      const data = await categoriaService.listarCategoria();
      setCategorias(data);

    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };
  useEffect(() => {
    fetchCategorias();
  }, []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredCategorias = [...categorias];

    // Filtrado por nombre de categoría
    if (hasSearchFilter) {
      filteredCategorias = filteredCategorias.filter((categoria) =>
        categoria.nombre_categoria.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Filtrado por estado (Activo/Inactivo)
    if (statusFilterActivo !== "all" && statusFilterActivo.size > 0) {
      const selectedStatuses = Array.from(statusFilterActivo).map((key) =>
        parseInt(key, 10)
      );// Convertir a número
      filteredCategorias = filteredCategorias.filter((categoria) =>
        selectedStatuses.includes(categoria.activo)
      );
    }


    return filteredCategorias;
  }, [categorias, filterValue, statusFilterActivo]);

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
  const renderCell = useCallback((categoria, columnKey) => {
    const cellValue = categoria[columnKey];

    switch (columnKey) {
      case "nombre_categoria":
        return <span>{categoria.nombre_categoria}</span>;

      case "activo":
        return (
          <Chip
            className="capitalize"
            size="sm"
            variant="flat"
            color={categoria.activo === 1 ? "success" : "danger"}
          >
            {categoria.activo === 1 ? "Activo" : "Inactivo"}
          </Chip>
        );

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
              
                <DropdownItem
                  onPress={() => openModal(categoria.id_categoria, "edit")}
                >
                  Editar
                </DropdownItem>
                <DropdownItem
                  onPress={() => openModal(categoria.id_categoria, "state")}
                >
                  Cambiar Estado
                </DropdownItem>
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

  const openModal = (categoriaId, action) => {
    setSelectedCategoriaId(categoriaId);
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
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtrar por estado"
                closeOnSelect={false}
                selectedKeys={statusFilterActivo}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setStatusFilterActivo(new Set([...keys]))
                }
              >
                {statusOptionsActivo.map((status) => (
                  <DropdownItem
                    key={status.uid.toString()}
                    className="capitalize"
                  >
                    {status.name}
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
            Total {categorias.length} Categorias
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
    statusFilterActivo,
    visibleColumns,
    onRowsPerPageChange,
    categorias.length,
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


  const actualizarTabla = (categoriaActualizado) => {
    setCategorias((prevCategorias) =>
      prevCategorias.map((categoria) =>
        categoria.id_categoria === categoriaActualizado.id_categoria
          ? categoriaActualizado
          : categoria
      )
    );
  };
  return (
    <>
      <Texto titulo texto={"Listado de Categorias"} />
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
        <TableBody emptyContent={"No hay Categorias"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id_categoria}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        size={modalAction === "edit" && "2xl"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => {
            switch (modalAction) {
              case "state":
                return (
                  <GestionActivo
                    onClose={onClose}
                    actualizarTabla={actualizarTabla}
                    categoriaId={selectedCategoriaId}
                  />
                );

              case "edit":
                return (
                  <EditarCategoria
                    onClose={onClose}
                    categoriaId={selectedCategoriaId}
                  />
                );
              default:
                return null;
            }
          }}
        </ModalContent>
      </Modal>
    </>
  );
}
