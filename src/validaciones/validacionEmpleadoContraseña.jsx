import * as yup from "yup";

const validacionEmpleadoContrasena = yup.object().shape({
    nueva_contraseña: yup.string()
        .required("La nueva contraseña es obligatoria.")
        .min(6, "La nueva contraseña debe tener al menos 6 caracteres."),
    confirmar_contraseña: yup.string()
        .required("Debes confirmar la nueva contraseña.")
        .oneOf(
            [yup.ref("nueva_contraseña"), null],
            "Las contraseñas no coinciden."
        ),
});
export default validacionEmpleadoContrasena;