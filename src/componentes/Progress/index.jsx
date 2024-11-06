import { Spinner } from "@nextui-org/react";
import React from "react";

export default function Progress() {
  return (
    <div className="flex items-center justify-center min-h-screen"
      style={{ minHeight: "calc(100vh - 90px)" }}>
      <Spinner label="Cargando..." size="lg" color="primary" />
    </div>
  );
}
