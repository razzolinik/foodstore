import { Rol } from "./Rol";

// Full user record, as stored in the "users" array (our fake table).
export interface IUsuario {
  id: string;
  email: string;
  password: string;
  rol: Rol;
}

// Reduced version kept in "userData" (the active session). No password
// travels here, so it doesn't linger in localStorage longer than needed.
export interface IUsuarioSesion {
  id: string;
  email: string;
  rol: Rol;
}
