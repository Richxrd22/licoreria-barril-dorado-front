import * as yup from "yup";

const validacionEmpleadoContrasena = yup.object().shape({
    nueva_contraseña: yup.string()
        .required("La nueva contraseña es obligatoria.")
        .min(6, "La nueva contraseña debe tener al menos 6 caracteres.")
        .matches(/[a-zA-Z]/, "La nueva contraseña debe contener al menos una letra") // Al menos una letra
        .matches(/\d/, "La nueva contraseña debe contener al menos un número") // Al menos un número
        .matches(/[^a-zA-Z0-9]/, "La nueva contraseña debe contener al menos un carácter especial") // Al menos un carácter especial
        ,
    confirmar_contraseña: yup.string()
        .required("Debes confirmar la nueva contraseña.")
        .oneOf(
            [yup.ref("nueva_contraseña"), null],
            "Las contraseñas no coinciden."
        ),
});
export default validacionEmpleadoContrasena;