import { obtenerProductos, obtenerSesion } from "../../utils/storage";
import { cerrarSesion } from "../../utils/auth";
import { IProducto } from "../../types/IProduct";

// References to the DOM containers where content gets injected.
const listaCategorias = document.getElementById("lista-categorias") as HTMLUListElement;
const contenedorProductos = document.getElementById("contenedor-productos") as HTMLDivElement;
const usuarioActual = document.getElementById("usuario-actual") as HTMLParagraphElement;
const logoutLink = document.getElementById("logout-link") as HTMLAnchorElement;

// Builds the category list from whatever categories exist in the
// product catalog, instead of a hardcoded array like before.
const cargarCategorias = (productos: IProducto[]): void => {
  const categorias = [...new Set(productos.map((p) => p.categoria))];

  categorias.forEach((categoria) => {
    const item = document.createElement("li");
    item.innerHTML = `<a href="#">${categoria}</a>`;
    listaCategorias.appendChild(item);
  });
};

// Renders one <article class="product-card"> per product, same markup
// as the original, with an "Agregar al carrito" button.
const cargarProductos = (productos: IProducto[]): void => {
  productos.forEach((producto) => {
    const card = document.createElement("article");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <p class="price">$${producto.precio.toFixed(2)}</p>
      <button type="button">Agregar al carrito</button>
    `;

    const botonAgregar = card.querySelector("button") as HTMLButtonElement;
    botonAgregar.addEventListener("click", () => {
      alert(`Agregaste "${producto.nombre}" al carrito`);
    });

    contenedorProductos.appendChild(card);
  });
};

logoutLink.addEventListener("click", (evento: MouseEvent) => {
  evento.preventDefault();
  cerrarSesion();
});

const sesion = obtenerSesion();
if (sesion) usuarioActual.textContent = `Sesión: ${sesion.email}`;

const productos = obtenerProductos();
cargarCategorias(productos);
cargarProductos(productos);
