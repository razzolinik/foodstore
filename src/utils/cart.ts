import { IProducto } from "../types/IProduct";
import { ICartItem } from "../types/ICartItem";


const CLAVE_CARRITO = "cart";

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


export function obtenerCarrito(): ICartItem[] {
  return obtenerItem<ICartItem[]>(CLAVE_CARRITO) ?? [];
}

function guardarCarrito(items: ICartItem[]): void {
  guardarItem<ICartItem[]>(CLAVE_CARRITO, items);
}


export function agregarAlCarrito(producto: IProducto, cantidad: number = 1): void {
  const items = obtenerCarrito();
  const existente = items.find((item) => item.producto.id === producto.id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    items.push({ producto, cantidad });
  }

  guardarCarrito(items);
}

export function actualizarCantidad(productoId: string, cantidad: number): void {
  const items = obtenerCarrito();
  const item = items.find((i) => i.producto.id === productoId);
  if (!item) return;

  if (cantidad <= 0) {
    eliminarDelCarrito(productoId);
    return;
  }

  item.cantidad = cantidad;
  guardarCarrito(items);
}


export function eliminarDelCarrito(productoId: string): void {
  const items = obtenerCarrito().filter((i) => i.producto.id !== productoId);
  guardarCarrito(items);
}


export function calcularTotal(): number {
  return obtenerCarrito().reduce(
    (total, item) => total + item.producto.precio * item.cantidad,
    0
  );
}

export function vaciarCarrito(): void {
  localStorage.removeItem(CLAVE_CARRITO);
}