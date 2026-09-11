import { Rol } from "../types/Rol";
import { IUsuario, IUsuarioSesion } from "../types/IUser";
import { obtenerUsuarios, guardarUsuarios, obtenerSesion, guardarSesion, borrarSesion } from "./storage";
import { redirigirA } from "./navigate";

const RUTA_LOGIN = "src/pages/auth/login/login.html";
const HOME_POR_ROL: Record<Rol, string> = {
  [Rol.ADMIN]: "src/pages/admin/admin.html",
  [Rol.CLIENT]: "src/pages/client/home/home.html",
};

export function registrarUsuario(email: string, password: string): void {
  const usuarios = obtenerUsuarios();
  const yaExiste = usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase());

  if (yaExiste) {
    throw new Error("Ya existe una cuenta registrada con ese email.");
  }

  const nuevoUsuario: IUsuario = {
    id: crypto.randomUUID(),
    email,
    password,
    rol: Rol.CLIENT,
  };

  guardarUsuarios([...usuarios, nuevoUsuario]);
}

export function iniciarSesion(email: string, password: string): IUsuarioSesion {
  const usuarios = obtenerUsuarios();
  const encontrado = usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!encontrado) {
    throw new Error("Email o contraseña incorrectos.");
  }

  const sesion: IUsuarioSesion = {
    id: encontrado.id,
    email: encontrado.email,
    rol: encontrado.rol,
  };

  guardarSesion(sesion);
  return sesion;
}

export function cerrarSesion(): void {
  borrarSesion();
  redirigirA(RUTA_LOGIN);
}

export function verificarSesionYRol(rolRequerido: Rol | null): void {
  if (!rolRequerido) return;

  const sesion = obtenerSesion();

  if (!sesion) {
    redirigirA(RUTA_LOGIN);
    return;
  }

  if (sesion.rol !== rolRequerido) {
    redirigirA(HOME_POR_ROL[sesion.rol]);
  }
}