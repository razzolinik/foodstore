import { iniciarSesion } from "../../../utils/auth";
import { redirigirA } from "../../../utils/navigate";
import { Rol } from "../../../types/Rol";

const formulario = document.getElementById("login-form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;
const mensajeError = document.getElementById("mensaje-error") as HTMLParagraphElement;

const HOME_POR_ROL: Record<Rol, string> = {
  [Rol.ADMIN]: "src/pages/admin/admin.html",
  [Rol.CLIENT]: "src/pages/client/home/home.html",
};

formulario.addEventListener("submit", (evento: SubmitEvent) => {
  evento.preventDefault();
  mensajeError.textContent = "";

  try {
    const sesion = iniciarSesion(inputEmail.value.trim(), inputPassword.value);
    redirigirA(HOME_POR_ROL[sesion.rol]);
  } catch (error) {
    mensajeError.textContent = error instanceof Error ? error.message : "Error inesperado.";
  }
});