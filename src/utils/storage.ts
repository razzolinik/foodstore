import { IUsuario, IUsuarioSesion } from "../types/IUser";
import { IProducto } from "../types/IProduct";
import { Rol } from "../types/Rol";

const CLAVE_USUARIOS = "users";
const CLAVE_SESION = "userData";
const CLAVE_PRODUCTOS = "products";

// Generic read/write so JSON.parse/stringify happens in one place only.
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

// ---------- Users ("fake" users table) ----------
export function obtenerUsuarios(): IUsuario[] {
  return obtenerItem<IUsuario[]>(CLAVE_USUARIOS) ?? [];
}

export function guardarUsuarios(usuarios: IUsuario[]): void {
  guardarItem<IUsuario[]>(CLAVE_USUARIOS, usuarios);
}

// ---------- Session (currently logged in user) ----------
export function obtenerSesion(): IUsuarioSesion | null {
  return obtenerItem<IUsuarioSesion>(CLAVE_SESION);
}

export function guardarSesion(usuario: IUsuarioSesion): void {
  guardarItem<IUsuarioSesion>(CLAVE_SESION, usuario);
}

export function borrarSesion(): void {
  localStorage.removeItem(CLAVE_SESION);
}

// ---------- Products (Food Store catalog) ----------
export function obtenerProductos(): IProducto[] {
  return obtenerItem<IProducto[]>(CLAVE_PRODUCTOS) ?? [];
}

export function guardarProductos(productos: IProducto[]): void {
  guardarItem<IProducto[]>(CLAVE_PRODUCTOS, productos);
}

// ---------- Seed data ----------
// First run only: creates one admin account (there is no admin
// registration flow) and loads the original catalog from data.js so
// the store isn't empty. Credentials are documented in the README.
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
    guardarProductos([
      {
        id: crypto.randomUUID(),
        nombre: "Hamburguesa Triple",
        descripcion: "Hamburguesa triple smash con mucho cheddar.",
        precio: 25000,
        imagen: "/assets/hamburguesa-triple.jpg",
        categoria: "Hamburguesas",
      },
      {
        id: crypto.randomUUID(),
        nombre: "Pizza Muzzarella",
        descripcion: "Salsa de tomate casera y muzzarella abundante.",
        precio: 18000,
        imagen: "/assets/pizza-muzzarella.jpg",
        categoria: "Pizzas",
      },
      {
        id: crypto.randomUUID(),
        nombre: "Papas Fritas",
        descripcion: "Porción grande de papas fritas crocantes.",
        precio: 9000,
        imagen: "/assets/papas-fritas.jpg",
        categoria: "Papas Fritas",
      },
      {
        id: crypto.randomUUID(),
        nombre: "Gaseosa Cola 1.5L",
        descripcion: "Bien fría, ideal para acompañar cualquier pedido.",
        precio: 3500,
        imagen: "/assets/gaseosa-cola.jpg",
        categoria: "Bebidas",
      },
    ]);
  }
}
