import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
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
import Texto from "../../../componentes/Texto";
import { columns, statusOptions } from "./adicionales/datos";
import { VerticalDotsIcon } from "../../../../public/Icons/VerticalDotsIcon";
import { SearchIcon } from "../../../../public/Icons/SearchIcon";
import { ChevronDownIcon } from "../../../../public/Icons/ChevronDownIcon";
import { capitalize } from "../../../adicionales/utils";
import { productoService } from "../../../services/ProductoService";
import EditarProducto from "././EditarProducto"
import GestionarStock from "././GestionarStock"
import InfoProducto from "././InfoProducto"

export default function ListadoProductos() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  //hook para obtener productos con stock
  const INITIAL_VISIBLE_COLUMNS = [
    "nombre",
    "descripcion",
    "cantidad",
    "estado_cantidad",
    "acciones",
  ];
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [productos, setProductos] = useState([]);
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5); // Tamaño de página
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "id_producto",
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const fetchProductos = async () => {
    try {
      const data = await productoService.listarProducto();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredProduct = [...productos];

    // Filtrado por nombre
    if (hasSearchFilter) {
      filteredProduct = filteredProduct.filter((product) =>
        product.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Filtrado por estado (Disponible/Agotado)
    if (statusFilter !== "all" && statusFilter.size > 0) {
      const selectedStatuses = Array.from(statusFilter).map((key) =>
        Number(key)
      ); // Convertir a número
      filteredProduct = filteredProduct.filter((product) =>
        selectedStatuses.includes(Number(product.estado_cantidad))
      );
    }

    return filteredProduct;
  }, [productos, filterValue, statusFilter]);

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

  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "nombre":
        return <span>{product.nombre}</span>;
      case "descripcion":
        return <span>{product.descripcion}</span>;
      case "cantidad":
        return <span>{product.cantidad}</span>;
      case "estado_cantidad":
        return (
          <Chip
            className="capitalize"
            size="sm"
            variant="flat"
            color={product.estado_cantidad ? "success" : "danger"}
          >
            {product.estado_cantidad === true ? "Disponible" : "Agotado"}
          </Chip>
        );
      case "fecha_produccion":
        return <span>{product.fecha_produccion}</span>;
      case "fecha_vencimiento":
        return <span>{product.fecha_vencimiento}</span>;
      case "categoria":
        return <span>{product.categoria}</span>;
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
                <DropdownItem onPress={() => openModal(product.id_producto, "view")}>Ver</DropdownItem>
                <DropdownItem onPress={() => openModal(product.id_producto, "stock")}>Stock</DropdownItem>
                <DropdownItem onPress={() => openModal(product.id_producto, "edit")}>Editar</DropdownItem>
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

  const openModal = (productId, action) => {
    setSelectedProductId(productId);
    setModalAction(action);
    onOpen(); // Abre el modal
  };

  const topContent = React.useMemo(() => {
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
            Total {productos.length} Productos
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
    productos.length,
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
      <Texto titulo texto={"Listado de Productos"} />
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
        <TableBody emptyContent={"No hay productos"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id_producto}>
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
                return <InfoProducto onClose={onClose} productId={selectedProductId} />;
              case "stock":
                return <GestionarStock onClose={onClose} productId={selectedProductId} />;
              case "edit":
                return <EditarProducto onClose={onClose} productId={selectedProductId} />;
              default:
                return null;
            }
          }}
        </ModalContent>
      </Modal>
    </>
  );
}
