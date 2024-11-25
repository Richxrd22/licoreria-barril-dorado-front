import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircleIcon } from "../../../public/Icons/CheckCircleIcon";
export default function Confirmacion({ruta}) {
  const location = useLocation(); 
  const { mensaje} = location.state || {};
  
  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ minHeight: "calc(100vh - 90px)" }}
      >
        <Card className="max-w-[500px]" shadow="lg">
          <div className="p-5 flex flex-col gap-5">
            <h2 className="text-center text-xl">Licoreria Barril Dorado</h2>
            <div className="flex  flex-col items-center gap-3">
              <CheckCircleIcon width="60px" height="60px" />
              <p className="text-center  text-lg">{mensaje}</p>
            </div>
            <Link
              className="bg-slate-800  text-white z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10  gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none data-[hover=true]:opacity-hover"
              to={ruta}
            >
              Volver
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}

