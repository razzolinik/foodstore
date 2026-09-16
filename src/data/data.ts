import { IProducto } from "../types/IProduct";
import { ICategoria } from "../types/ICategoria";


// Catálogo semilla: solo se usa una vez, para poblar localStorage
// la primera vez que se abre la app (ver sembrarDatosIniciales en utils/storage.ts).
// Ni el catálogo del cliente ni el panel de admin leen este array directamente:
// ambos leen de localStorage a través de obtenerProductos().
export const PRODUCTS_SEED: IProducto[] = [
  {
    id: "p1",
    nombre: "Hamburguesa Triple",
    descripcion: "Hamburguesa triple smash con mucho cheddar.",
    precio: 25000,
    imagen: "/assets/hamburguesa-triple.jpg",
    categoria: "Hamburguesas",
  },
  {
    id: "p2",
    nombre: "Hamburguesa Clásica",
    descripcion: "Medallón simple, lechuga, tomate y mayonesa.",
    precio: 18000,
    imagen: "/assets/hamburguesa-triple.jpg",
    categoria: "Hamburguesas",
  },
  {
    id: "p3",
    nombre: "Pizza Muzzarella",
    descripcion: "Salsa de tomate casera y muzzarella abundante.",
    precio: 18000,
    imagen: "/assets/pizza-muzzarella.jpg",
    categoria: "Pizzas",
  },
  {
    id: "p4",
    nombre: "Pizza Napolitana",
    descripcion: "Con rodajas de tomate fresco, ajo y albahaca.",
    precio: 19500,
    imagen: "/assets/pizza-muzzarella.jpg",
    categoria: "Pizzas",
  },
  {
    id: "p5",
    nombre: "Papas Fritas",
    descripcion: "Porción grande de papas fritas crocantes.",
    precio: 9000,
    imagen: "/assets/papas-fritas.jpg",
    categoria: "Papas Fritas",
  },
  {
    id: "p6",
    nombre: "Papas con Cheddar y Bacon",
    descripcion: "Papas fritas cubiertas con cheddar fundido y bacon.",
    precio: 12500,
    imagen: "/assets/papas-fritas.jpg",
    categoria: "Papas Fritas",
  },
  {
    id: "p7",
    nombre: "Gaseosa Cola 1.5L",
    descripcion: "Bien fría, ideal para acompañar cualquier pedido.",
    precio: 3500,
    imagen: "/assets/gaseosa-cola.jpg",
    categoria: "Bebidas",
  },
  {
    id: "p8",
    nombre: "Agua Mineral 500ml",
    descripcion: "Agua sin gas, botella individual.",
    precio: 1800,
    imagen: "/assets/gaseosa-cola.jpg",
    categoria: "Bebidas",
  },
];


export function getCategories(productos: IProducto[]): ICategoria[] {
  const nombresUnicos = [...new Set(productos.map((p) => p.categoria))];
  return nombresUnicos.map((nombre, index) => ({
    id: String(index + 1),
    nombre,
  }));
}