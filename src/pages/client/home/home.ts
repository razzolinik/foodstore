import { getCategories } from "../../../data/data";
import { agregarAlCarrito } from "../../../utils/cart";
import { obtenerSesion, obtenerProductos } from "../../../utils/storage";
import { cerrarSesion } from "../../../utils/auth";
import { mostrarToast, actualizarContadorCarrito, formatearPrecio } from "../../../utils/ui";
import { IProducto } from "../../../types/IProduct";

const listaCategorias = document.getElementById("lista-categorias") as HTMLUListElement;
const contenedorProductos = document.getElementById("contenedor-productos") as HTMLDivElement;
const sinResultados = document.getElementById("sin-resultados") as HTMLDivElement;
const textoSinResultados = document.getElementById("texto-sin-resultados") as HTMLParagraphElement;
const contadorResultados = document.getElementById("contador-resultados") as HTMLParagraphElement;
const tituloCatalogo = document.getElementById("titulo-catalogo") as HTMLHeadingElement;
const inputBusqueda = document.getElementById("buscar-producto") as HTMLInputElement;
const formBusqueda = document.getElementById("form-busqueda") as HTMLFormElement;
const botonLimpiar = document.getElementById("limpiar-busqueda") as HTMLButtonElement;
const botonVerTodo = document.getElementById("ver-todo") as HTMLButtonElement;
const usuarioActual = document.getElementById("usuario-actual") as HTMLParagraphElement;
const logoutLink = document.getElementById("logout-link") as HTMLAnchorElement;

// Fuente única de verdad: lo que haya en localStorage bajo "products".
// Se lee una sola vez al cargar la página (igual que hacía antes con
// el array estático PRODUCTS), pero ahora refleja lo que admin haya
// agregado, editado o eliminado.
const productos = obtenerProductos();

let textoBusqueda = "";
let categoriaSeleccionada: string | null = null;

const escapar = (texto: string): string =>
  texto.replace(/[&<>"']/g, (caracter) => {
    const mapa: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return mapa[caracter] ?? caracter;
  });

const cargarCategorias = (): void => {
  const categorias = getCategories(productos);

  listaCategorias.innerHTML = `
    <li><a href="#" data-categoria="">Todas las categorías</a></li>
    ${categorias
      .map(
        (cat) =>
          `<li><a href="#" data-categoria="${escapar(cat.nombre)}">${escapar(cat.nombre)}</a></li>`
      )
      .join("")}
  `;

  listaCategorias.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    link.addEventListener("click", (evento: MouseEvent) => {
      evento.preventDefault();
      const categoria = link.dataset.categoria ?? "";
      categoriaSeleccionada = categoria === "" ? null : categoria;
      marcarCategoriaActiva();
      renderizarProductos();
    });
  });

  marcarCategoriaActiva();
};

const marcarCategoriaActiva = (): void => {
  listaCategorias.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    const esActiva = (link.dataset.categoria ?? "") === (categoriaSeleccionada ?? "");
    link.classList.toggle("activo", esActiva);
  });
};

const obtenerProductosFiltrados = (): IProducto[] => {
  const busqueda = textoBusqueda.trim().toLowerCase();

  return productos.filter((producto) => {
    const coincideNombre = producto.nombre.toLowerCase().includes(busqueda);
    const coincideCategoria =
      categoriaSeleccionada === null || producto.categoria === categoriaSeleccionada;
    return coincideNombre && coincideCategoria;
  });
};

const crearTarjeta = (producto: IProducto): HTMLElement => {
  const card = document.createElement("article");
  card.classList.add("product-card");

  card.innerHTML = `
    <img src="${producto.imagen}" alt="${escapar(producto.nombre)}" loading="lazy">
    <div class="card-body">
      <span class="etiqueta-categoria">${escapar(producto.categoria)}</span>
      <h3>${escapar(producto.nombre)}</h3>
      <p class="descripcion">${escapar(producto.descripcion)}</p>
      <p class="price">${formatearPrecio(producto.precio)}</p>
      <button type="button" class="btn-primario">🛒 Agregar al carrito</button>
    </div>
  `;

  const botonAgregar = card.querySelector("button") as HTMLButtonElement;

  botonAgregar.addEventListener("click", () => {
    agregarAlCarrito(producto, 1);
    actualizarContadorCarrito(true);
    mostrarToast(`${producto.nombre} se agregó al carrito`);
  });

  return card;
};

const renderizarProductos = (): void => {
  const productos = obtenerProductosFiltrados();

  tituloCatalogo.textContent =
    categoriaSeleccionada === null ? "Catálogo de productos" : categoriaSeleccionada;

  contenedorProductos.innerHTML = "";
  productos.forEach((producto) => contenedorProductos.appendChild(crearTarjeta(producto)));

  const hayResultados = productos.length > 0;
  sinResultados.hidden = hayResultados;
  contenedorProductos.hidden = !hayResultados;

  if (hayResultados) {
    contadorResultados.textContent =
      productos.length === 1 ? "1 producto encontrado" : `${productos.length} productos encontrados`;
  } else {
    contadorResultados.textContent = "";
    const busqueda = textoBusqueda.trim();
    textoSinResultados.textContent = busqueda
      ? `No hay productos que coincidan con "${busqueda}"${
          categoriaSeleccionada ? ` en ${categoriaSeleccionada}` : ""
        }.`
      : "No hay productos en esta categoría.";
  }
};

const reiniciarFiltros = (): void => {
  textoBusqueda = "";
  categoriaSeleccionada = null;
  inputBusqueda.value = "";
  botonLimpiar.classList.remove("visible");
  marcarCategoriaActiva();
  renderizarProductos();
};

formBusqueda.addEventListener("submit", (evento: SubmitEvent) => evento.preventDefault());

inputBusqueda.addEventListener("input", () => {
  textoBusqueda = inputBusqueda.value;
  botonLimpiar.classList.toggle("visible", textoBusqueda.length > 0);
  renderizarProductos();
});

botonLimpiar.addEventListener("click", () => {
  textoBusqueda = "";
  inputBusqueda.value = "";
  botonLimpiar.classList.remove("visible");
  inputBusqueda.focus();
  renderizarProductos();
});

botonVerTodo.addEventListener("click", reiniciarFiltros);

logoutLink.addEventListener("click", (evento: MouseEvent) => {
  evento.preventDefault();
  cerrarSesion();
});

const sesion = obtenerSesion();
if (sesion) usuarioActual.textContent = `Sesión iniciada como ${sesion.email}`;

cargarCategorias();
renderizarProductos();
actualizarContadorCarrito();