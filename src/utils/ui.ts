import { contarItems } from "./cart";

type TipoToast = "exito" | "info";

const ICONOS: Record<TipoToast, string> = {
  exito: "✅",
  info: "ℹ️",
};

export function mostrarToast(mensaje: string, tipo: TipoToast = "exito"): void {
  const contenedor = document.getElementById("contenedor-toast");
  if (!contenedor) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `<span class="icono-toast" aria-hidden="true">${ICONOS[tipo]}</span><span></span>`;

  const texto = toast.querySelector("span:last-child") as HTMLSpanElement;
  texto.textContent = mensaje;

  contenedor.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("saliendo");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, 2200);
}

export function actualizarContadorCarrito(animar: boolean = false): void {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;

  const total = contarItems();
  contador.textContent = String(total);
  contador.title = total === 1 ? "1 producto en el carrito" : `${total} productos en el carrito`;

  if (animar) {
    contador.classList.remove("pulso");
    void contador.offsetWidth;
    contador.classList.add("pulso");
  }
}

export function formatearPrecio(valor: number): string {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
}