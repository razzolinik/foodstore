import {
  obtenerCarrito,
  actualizarCantidad,
  eliminarDelCarrito,
  calcularTotal,
  contarItems,
  vaciarCarrito,
} from "../../../utils/cart";
import { obtenerSesion } from "../../../utils/storage";
import { cerrarSesion } from "../../../utils/auth";
import { mostrarToast, actualizarContadorCarrito, formatearPrecio } from "../../../utils/ui";

const carritoVacio = document.getElementById("carrito-vacio") as HTMLDivElement;
const panelCarrito = document.getElementById("panel-carrito") as HTMLDivElement;
const cuerpoCarrito = document.getElementById("cuerpo-carrito") as HTMLTableSectionElement;
const resumenCarrito = document.getElementById("resumen-carrito") as HTMLElement;
const resumenItems = document.getElementById("resumen-items") as HTMLSpanElement;
const resumenSubtotal = document.getElementById("resumen-subtotal") as HTMLSpanElement;
const totalCarrito = document.getElementById("total-carrito") as HTMLSpanElement;
const botonVaciar = document.getElementById("vaciar-carrito") as HTMLButtonElement;
const usuarioActual = document.getElementById("usuario-actual") as HTMLParagraphElement;
const logoutLink = document.getElementById("logout-link") as HTMLAnchorElement;

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

const renderizarCarrito = (): void => {
  const items = obtenerCarrito();
  const hayItems = items.length > 0;

  carritoVacio.hidden = hayItems;
  panelCarrito.hidden = !hayItems;
  resumenCarrito.hidden = !hayItems;

  actualizarContadorCarrito();

  if (!hayItems) {
    cuerpoCarrito.innerHTML = "";
    return;
  }

  cuerpoCarrito.innerHTML = items
    .map(
      (item) => `
      <tr data-id="${escapar(item.producto.id)}">
        <td>
          <div class="celda-producto">
            <img src="${item.producto.imagen}" alt="${escapar(item.producto.nombre)}">
            <div>
              <strong>${escapar(item.producto.nombre)}</strong>
              <small>${escapar(item.producto.categoria)}</small>
            </div>
          </div>
        </td>
        <td>${formatearPrecio(item.producto.precio)}</td>
        <td>
          <div class="control-cantidad">
            <button type="button" data-accion="restar" data-id="${escapar(item.producto.id)}"
              aria-label="Quitar una unidad">−</button>
            <span class="cantidad">${item.cantidad}</span>
            <button type="button" data-accion="sumar" data-id="${escapar(item.producto.id)}"
              aria-label="Agregar una unidad">+</button>
          </div>
        </td>
        <td class="subtotal">${formatearPrecio(item.producto.precio * item.cantidad)}</td>
        <td>
          <button type="button" class="btn-quitar" data-accion="quitar"
            data-id="${escapar(item.producto.id)}" aria-label="Quitar del carrito" title="Quitar">🗑</button>
        </td>
      </tr>
    `
    )
    .join("");

  const unidades = contarItems();
  const total = calcularTotal();

  resumenItems.textContent = unidades === 1 ? "1 producto" : `${unidades} productos`;
  resumenSubtotal.textContent = formatearPrecio(total);
  totalCarrito.textContent = formatearPrecio(total);
};

cuerpoCarrito.addEventListener("click", (evento: MouseEvent) => {
  const boton = (evento.target as HTMLElement).closest("button");
  if (!boton) return;

  const id = boton.dataset.id;
  const accion = boton.dataset.accion;
  if (!id || !accion) return;

  const item = obtenerCarrito().find((i) => i.producto.id === id);
  if (!item) return;

  if (accion === "sumar") {
    actualizarCantidad(id, item.cantidad + 1);
  } else if (accion === "restar") {
    actualizarCantidad(id, item.cantidad - 1);
  } else if (accion === "quitar") {
    eliminarDelCarrito(id);
    mostrarToast(`${item.producto.nombre} se quitó del carrito`, "info");
  }

  renderizarCarrito();
});

botonVaciar.addEventListener("click", () => {
  vaciarCarrito();
  renderizarCarrito();
  mostrarToast("Vaciaste el carrito", "info");
});

logoutLink.addEventListener("click", (evento: MouseEvent) => {
  evento.preventDefault();
  cerrarSesion();
});

const sesion = obtenerSesion();
if (sesion) usuarioActual.textContent = `Sesión iniciada como ${sesion.email}`;

renderizarCarrito();