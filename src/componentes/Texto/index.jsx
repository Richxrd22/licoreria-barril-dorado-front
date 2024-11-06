import React from "react";

export default function Texto({ texto, titulo }) {
  return (
    <>
      {titulo ? (
        <h2 className="   font-medium md:text-lg lg:text-xl">
          {texto}
        </h2>
      ) : null}
    </>
  );
}
