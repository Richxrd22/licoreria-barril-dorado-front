import * as yup from "yup";
const validacionEmpleadoContrasena = yup.object({
    nueva_contraseña: yup
        .string()
        .required("La nueva contraseña es obligatoria") // Campo obligatorio
        .min(8, "La nueva contraseña debe tener al menos 8 caracteres") // Longitud mínima
        .matches(/[a-zA-Z]/, "La nueva contraseña debe contener al menos una letra") // Al menos una letra
        .matches(/\d/, "La nueva contraseña debe contener al menos un número") // Al menos un número
        .matches(/[^a-zA-Z0-9]/, "La nueva contraseña debe contener al menos un carácter especial") // Al menos un carácter especial
});
export default validacionEmpleadoContrasena;