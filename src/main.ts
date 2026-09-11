import { Rol } from "./types/Rol";
import { verificarSesionYRol } from "./utils/auth";
import { sembrarDatosIniciales } from "./utils/storage";

// Every protected page includes this file first and declares the role
// it needs via <body data-role="admin|client">. Public pages (login,
// registro) simply omit data-role.
function protegerPaginaActual(): void {
  const rolRequerido = document.body.dataset.role as Rol | undefined;
  verificarSesionYRol(rolRequerido ?? null);
}

sembrarDatosIniciales();
protegerPaginaActual();
