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
import {
  columns,
  statusOptionsActivo,
  statusOptionsEstadoCantidad,
  statusOptionsVencimiento,
} from "./adicionales/datos";
import { VerticalDotsIcon } from "../../../../public/Icons/VerticalDotsIcon";
import { SearchIcon } from "../../../../public/Icons/SearchIcon";
import { ChevronDownIcon } from "../../../../public/Icons/ChevronDownIcon";
import { capitalize } from "../../../adicionales/utils";
import EditarProducto from "././EditarProducto";
import GestionarStock from "././GestionarStock";
import InfoProducto from "././InfoProducto";
import GestionActivo from "./GestionActivo";
import { useProductos } from "../../../hook/useProductos";
import { useDecodedToken } from "../../../hook/useDecodedToken";
export default function ListadoProductos({
  productos = [],
  setProductos,
  actualizarTabla,
  showFilters = true,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { rol } = useDecodedToken();
  const INITIAL_VISIBLE_COLUMNS = [
    "nombre",
    "descripcion",
    "cantidad",
    "empresa",
    "fecha_vencimiento",
    "estado_cantidad",
    "activo",
    "acciones",
  ];
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilterActivo, setStatusFilterActivo] = useState(new Set(["1"]));
  const [statusFilterEstadoStock, setStatusFilterEstadoStock] = useState(
    new Set(["1"])
  );
  const [statusFilterVencimiento, setStatusFilterVencimiento] = useState(
    new Set(["1"])
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "id_producto",
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);



  const filteredItems = useMemo(() => {
    let filteredProduct = [...productos];

    if (filterValue) {
      filteredProduct = filteredProduct.filter((product) =>
        product.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilterEstadoStock.size > 0) {
      const selectedEstadosCantidad = Array.from(statusFilterEstadoStock).map(
        (key) => parseInt(key, 10)
      );
      filteredProduct = filteredProduct.filter((product) =>
        selectedEstadosCantidad.includes(product.estado_cantidad)
      );
    }

    if (statusFilterActivo.size > 0) {
      const selectedStatuses = Array.from(statusFilterActivo).map((key) =>
        parseInt(key, 10)
      );
      filteredProduct = filteredProduct.filter((product) =>
        selectedStatuses.includes(product.activo)
      );
    }

    if (statusFilterVencimiento.size > 0) {
      const selectedStatuses = Array.from(statusFilterVencimiento).map((key) => parseInt(key, 10));

      filteredProduct = filteredProduct.filter((product) => {
        const fechaVencimiento = new Date(product.fecha_vencimiento);
        const fechaActual = new Date();

        if (isNaN(fechaVencimiento)) return false;

        const isVencido = fechaVencimiento < fechaActual;
        const isNoVencido = fechaVencimiento >= fechaActual;

        return (
          (selectedStatuses.includes(0) && isVencido) ||
          (selectedStatuses.includes(1) && isNoVencido)
        );
      });
    }

    return filteredProduct;
  }, [
    productos,
    filterValue,
    statusFilterEstadoStock,
    statusFilterActivo,
    statusFilterVencimiento,
  ]);


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
    const fechaVencimiento = new Date(product.fecha_vencimiento);
    const fechaActual = new Date();
    const isVencido = fechaVencimiento < fechaActual;
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
            color={product.estado_cantidad === 1 ? "success" : "danger"}
          >
            {product.estado_cantidad === 1 ? "Disponible" : "Agotado"}
          </Chip>
        );
      case "fecha_produccion":
        return <span>{product.fecha_produccion}</span>;
      case "fecha_vencimiento":
        return <span>{product.fecha_vencimiento}</span>;
      case "categoria":
        return <span>{product.categoria}</span>;
      case "activo":
        return (
          <Chip
            className="capitalize"
            size="sm"
            variant="flat"
            color={product.activo === 1 ? "success" : "danger"}
          >
            {product.activo === 1 ? "Activo" : "Inactivo"}
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
                <DropdownItem onPress={() => openModal(product.id_producto, "view")}>
                  Ver
                </DropdownItem>
                {product.activo !== 0 && !isVencido && (
                  <DropdownItem onPress={() => openModal(product.id_producto, "stock")}>
                    Gestionar Stock
                  </DropdownItem>
                )}
                {rol && (
                  <DropdownItem onPress={() => openModal(product.id_producto, "state")}>
                    Cambiar Estado
                  </DropdownItem>
                )}
                {product.activo !== 0 && (
                  <DropdownItem onPress={() => openModal(product.id_producto, "edit")}>
                    Editar
                  </DropdownItem>
                )}
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
    onOpen();
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
            {/* Filtro de Vencimiento solo si showFilters es true */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Vencimiento
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtrar por vencimiento"
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={statusFilterVencimiento}
                onSelectionChange={(keys) => {
                  setStatusFilterVencimiento(new Set([...keys]));
                }}
              >
                {statusOptionsVencimiento.map((status) => (
                  <DropdownItem
                    key={status.uid.toString()}
                    className="capitalize"
                  >
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Filtro de Estado Cantidad solo si showFilters es true */}
            {showFilters && (
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="flat"
                  >
                    Estado Cantidad
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Filtrar por estado cantidad"
                  closeOnSelect={false}
                  selectedKeys={statusFilterEstadoStock}
                  selectionMode="multiple"
                  onSelectionChange={(keys) =>
                    setStatusFilterEstadoStock(new Set([...keys]))
                  }
                >
                  {statusOptionsEstadoCantidad.map((status) => (
                    <DropdownItem
                      key={status.uid.toString()}
                      className="capitalize"
                    >
                      {status.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Filtro de Estado solo si showFilters es true */}
            {showFilters && (
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
            )}

            {/* Filtro de Columnas siempre visible */}
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
    showFilters, // Asegúrate de agregar showFilters al arreglo de dependencias
    filterValue,
    statusFilterEstadoStock,
    statusFilterActivo,
    statusFilterVencimiento,
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

      <Modal
        size={modalAction === "edit" && "2xl"}
        hideCloseButton={modalAction === "state" && true}
        isDismissable={modalAction === "state" ? false : true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => {
            switch (modalAction) {
              case "view":
                return (
                  <InfoProducto
                    onClose={onClose}
                    productId={selectedProductId}
                  />
                );
              case "stock":
                return (
                  <GestionarStock
                    onClose={onClose}
                    productId={selectedProductId}
                  />
                );
              case "edit":
                return (
                  <EditarProducto
                    onClose={onClose}
                    productId={selectedProductId}
                  />
                );
              case "state":
                return (
                  <GestionActivo
                    actualizarTabla={actualizarTabla}
                    onClose={onClose}
                    productId={selectedProductId}
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
