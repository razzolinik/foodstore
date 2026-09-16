import { IUsuario, IUsuarioSesion } from "../types/IUser";
import { IProducto } from "../types/IProduct";
import { Rol } from "../types/Rol";
import { PRODUCTS_SEED } from "../data/data";

const CLAVE_USUARIOS = "users";
const CLAVE_SESION = "userData";
const CLAVE_PRODUCTOS = "products";

function obtenerItem<T>(clave: string): T | null {
  const raw = localStorage.getItem(clave);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function guardarItem<T>(clave: string, valor: T): void {
  localStorage.setItem(clave, JSON.stringify(valor));
}


export function obtenerUsuarios(): IUsuario[] {
  return obtenerItem<IUsuario[]>(CLAVE_USUARIOS) ?? [];
}

export function guardarUsuarios(usuarios: IUsuario[]): void {
  guardarItem<IUsuario[]>(CLAVE_USUARIOS, usuarios);
}


export function obtenerSesion(): IUsuarioSesion | null {
  return obtenerItem<IUsuarioSesion>(CLAVE_SESION);
}

export function guardarSesion(usuario: IUsuarioSesion): void {
  guardarItem<IUsuarioSesion>(CLAVE_SESION, usuario);
}

export function borrarSesion(): void {
  localStorage.removeItem(CLAVE_SESION);
}


export function obtenerProductos(): IProducto[] {
  return obtenerItem<IProducto[]>(CLAVE_PRODUCTOS) ?? [];
}

export function guardarProductos(productos: IProducto[]): void {
  guardarItem<IProducto[]>(CLAVE_PRODUCTOS, productos);
}


export function sembrarDatosIniciales(): void {
  if (obtenerUsuarios().length === 0) {
    guardarUsuarios([
      {
        id: crypto.randomUUID(),
        email: "admin@foodstore.com",
        password: "admin123",
        rol: Rol.ADMIN,
      },
    ]);
  }

  if (obtenerProductos().length === 0) {
    // Se siembra desde el mismo catálogo que usa el cliente (PRODUCTS_SEED en data/data.ts),
    // así admin y cliente arrancan viendo exactamente los mismos productos.
    guardarProductos(
      PRODUCTS_SEED.map((producto) => ({
        ...producto,
        id: crypto.randomUUID(),
      }))
    );
  }
}