import { PRODUCTS, getCategories } from "../../../data/data";
import { agregarAlCarrito } from "../../../utils/cart";
import { obtenerSesion } from "../../../utils/storage";
import { cerrarSesion } from "../../../utils/auth";
import { IProducto } from "../../../types/IProduct";

const listaCategorias = document.getElementById("lista-categorias") as HTMLUListElement;
const contenedorProductos = document.getElementById("contenedor-productos") as HTMLDivElement;
const sinResultados = document.getElementById("sin-resultados") as HTMLParagraphElement;
const inputBusqueda = document.getElementById("buscar-producto") as HTMLInputElement;
const formBusqueda = document.getElementById("form-busqueda") as HTMLFormElement;
const usuarioActual = document.getElementById("usuario-actual") as HTMLParagraphElement;
const logoutLink = document.getElementById("logout-link") as HTMLAnchorElement;


let textoBusqueda = "";
let categoriaSeleccionada: string | null = null;


const cargarCategorias = (): void => {
  const categorias = getCategories();

  listaCategorias.innerHTML = `
    <li><a href="#" data-categoria="">Todas</a></li>
    ${categorias
      .map((cat) => `<li><a href="#" data-categoria="${cat.nombre}">${cat.nombre}</a></li>`)
      .join("")}
  `;

  listaCategorias.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (evento) => {
      evento.preventDefault();
      const categoria = (evento.target as HTMLAnchorElement).dataset.categoria;
      categoriaSeleccionada = categoria ? categoria : null;
      renderizarProductos();
    });
  });
};


const obtenerProductosFiltrados = (): IProducto[] => {
  return PRODUCTS.filter((producto) => {
    const coincideNombre = producto.nombre
      .toLowerCase()
      .includes(textoBusqueda.toLowerCase());
    const coincideCategoria =
      !categoriaSeleccionada || producto.categoria === categoriaSeleccionada;
    return coincideNombre && coincideCategoria;
  });
};


const renderizarProductos = (): void => {
  const productos = obtenerProductosFiltrados();
  contenedorProductos.innerHTML = "";
  sinResultados.style.display = productos.length === 0 ? "block" : "none";

  productos.forEach((producto) => {
    const card = document.createElement("article");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <p class="price">$${producto.precio.toFixed(2)}</p>
      <button type="button">Agregar al carrito</button>
      <span class="mensaje-ok" style="display: none;">Agregado ✓</span>
    `;

    const botonAgregar = card.querySelector("button") as HTMLButtonElement;
    const mensajeOk = card.querySelector(".mensaje-ok") as HTMLSpanElement;

    botonAgregar.addEventListener("click", () => {
      agregarAlCarrito(producto, 1);
      mensajeOk.style.display = "inline";
      setTimeout(() => {
        mensajeOk.style.display = "none";
      }, 1200);
    });

    contenedorProductos.appendChild(card);
  });
};

formBusqueda.addEventListener("submit", (evento) => evento.preventDefault());
inputBusqueda.addEventListener("input", () => {
  textoBusqueda = inputBusqueda.value;
  renderizarProductos();
});

logoutLink.addEventListener("click", (evento: MouseEvent) => {
  evento.preventDefault();
  cerrarSesion();
});

const sesion = obtenerSesion();
if (sesion) usuarioActual.textContent = `Sesión: ${sesion.email}`;

cargarCategorias();
renderizarProductos();