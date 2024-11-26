import { Button, ModalBody, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { empresaService } from '../../../services/EmpresaService';
import Progress from '../../../componentes/Progress';

export default function InfoEmpresa({ onClose, empresaId }) {
  const [empresa, setEmpresa] = useState(null);

  const fetchEmpresa = async () => {
    try {
      const data = await empresaService.obtenerEmpresaId(empresaId);
      setEmpresa(data);
    } catch (error) {
      console.error("Error al obtener los detalles del producto:", error);
    }
  };

  useEffect(() => {
    if (empresaId) {
      fetchEmpresa();
    }
  }, [empresaId]);

  if (!empresa) return <Progress />;
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Información de la Empresa
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between">
            <strong>Nombre:</strong>
            <span>{empresa.nombre || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <strong>Ruc:</strong>
            <span>{empresa.ruc || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <strong>Website:</strong>
            <span>{empresa.website || "0"}</span>
          </div>
        </div>
      
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="solid" onPress={onClose}>
          Cerrar
        </Button>
      </ModalFooter>
    </>
  )
}
