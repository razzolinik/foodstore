import { registrarUsuario } from "../../../utils/auth";
import { redirigirA } from "../../../utils/navigate";

const formulario = document.getElementById("registro-form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;
const mensajeError = document.getElementById("mensaje-error") as HTMLParagraphElement;

formulario.addEventListener("submit", (evento: SubmitEvent) => {
  evento.preventDefault();
  mensajeError.textContent = "";

  try {
    registrarUsuario(inputEmail.value.trim(), inputPassword.value);
    redirigirA("/src/pages/auth/login/login.html");
  } catch (error) {
    mensajeError.textContent = error instanceof Error ? error.message : "Error inesperado.";
  }
});
