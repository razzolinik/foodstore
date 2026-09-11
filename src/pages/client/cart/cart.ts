import {
  obtenerCarrito,
  actualizarCantidad,
  eliminarDelCarrito,
  calcularTotal,
} from "../../../utils/cart";
import { obtenerSesion } from "../../../utils/storage";
import { cerrarSesion } from "../../../utils/auth";

const carritoVacio = document.getElementById("carrito-vacio") as HTMLParagraphElement;
const tablaCarrito = document.getElementById("tabla-carrito") as HTMLTableElement;
const cuerpoCarrito = document.getElementById("cuerpo-carrito") as HTMLTableSectionElement;
const totalCarrito = document.getElementById("total-carrito") as HTMLHeadingElement;
const usuarioActual = document.getElementById("usuario-actual") as HTMLParagraphElement;
const logoutLink = document.getElementById("logout-link") as HTMLAnchorElement;

// Renders the cart table (or the empty-cart message) plus the running total.
const renderizarCarrito = (): void => {
  const items = obtenerCarrito();

  if (items.length === 0) {
    carritoVacio.style.display = "block";
    tablaCarrito.style.display = "none";
    totalCarrito.textContent = "";
    return;
  }

  carritoVacio.style.display = "none";
  tablaCarrito.style.display = "table";

  cuerpoCarrito.innerHTML = items
    .map(
      (item) => `
      <tr data-id="${item.producto.id}">
        <td>${item.producto.nombre}</td>
        <td>$${item.producto.precio.toFixed(2)}</td>
        <td><input type="number" min="1" value="${item.cantidad}" class="input-cantidad" data-id="${item.producto.id}"></td>
        <td>$${(item.producto.precio * item.cantidad).toFixed(2)}</td>
        <td><a href="#" class="quitar" data-id="${item.producto.id}">Quitar</a></td>
      </tr>
    `
    )
    .join("");

  totalCarrito.textContent = `Total: $${calcularTotal().toFixed(2)}`;

  cuerpoCarrito.querySelectorAll(".input-cantidad").forEach((input) => {
    input.addEventListener("change", (evento) => {
      const target = evento.target as HTMLInputElement;
      actualizarCantidad(target.dataset.id as string, Number(target.value));
      renderizarCarrito();
    });
  });

  cuerpoCarrito.querySelectorAll(".quitar").forEach((link) => {
    link.addEventListener("click", (evento) => {
      evento.preventDefault();
      const id = (evento.target as HTMLAnchorElement).dataset.id as string;
      eliminarDelCarrito(id);
      renderizarCarrito();
    });
  });
};

logoutLink.addEventListener("click", (evento: MouseEvent) => {
  evento.preventDefault();
  cerrarSesion();
});

const sesion = obtenerSesion();
if (sesion) usuarioActual.textContent = `Sesión: ${sesion.email}`;

renderizarCarrito();