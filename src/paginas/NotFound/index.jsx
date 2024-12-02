import React from "react";
import { Link } from "react-router-dom";
import { useDecodedToken } from "../../hook/useDecodedToken";

export default function NotFound() {
  const { baseRoute } = useDecodedToken();
  const token = localStorage.getItem("token")
  return (
    <main className="flex h-screen items-center w-5/6 m-auto  justify-center  ">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
          Lo sentimos, la página que estás buscando no existe.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {token ? (
            <>
              <Link
                to={`${baseRoute}/panel`}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Regresar al Inicio
              </Link>
            </>
          ) : (
            <>
              <Link
                to={`/`}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Regresar al Inicio
              </Link>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
