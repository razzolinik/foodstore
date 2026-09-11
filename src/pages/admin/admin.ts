import { obtenerProductos, guardarProductos, obtenerSesion } from "../../utils/storage";
import { cerrarSesion } from "../../utils/auth";
import { IProducto } from "../../types/IProduct";

const tablaProductos = document.getElementById("tabla-productos") as HTMLTableSectionElement;
const formulario = document.getElementById("producto-form") as HTMLFormElement;
const inputNombre = document.getElementById("nombre-producto") as HTMLInputElement;
const inputPrecio = document.getElementById("precio-producto") as HTMLInputElement;
const selectCategoria = document.getElementById("categoria-producto") as HTMLSelectElement;
const textareaDescripcion = document.getElementById("descripcion-producto") as HTMLTextAreaElement;
const usuarioActual = document.getElementById("usuario-actual") as HTMLParagraphElement;
const logoutLink = document.getElementById("logout-link") as HTMLAnchorElement;
const editorProducto = document.getElementById("producto-editor") as HTMLDetailsElement;
const tituloEditor = document.getElementById("producto-editor-titulo") as HTMLElement;
const botonGuardar = document.getElementById("guardar-producto") as HTMLButtonElement;
const botonCancelar = document.getElementById("cancelar-edicion") as HTMLButtonElement;
let productoEditandoId: string | null = null;

// Renders one <tr> per product, with working "Editar" / "Eliminar" links
// (the original repo left these as placeholder "#" links).
const cargarTabla = (): void => {
  const productos = obtenerProductos();
  tablaProductos.innerHTML = "";

  productos.forEach((producto) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}" width="60">` : "—"}</td>
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td><strong>$${producto.precio.toFixed(2)}</strong></td>
      <td><a data-accion="editar" data-id="${producto.id}">Editar</a> / <a data-accion="eliminar" data-id="${producto.id}">Eliminar</a></td>
    `;
    tablaProductos.appendChild(fila);
  });

  tablaProductos.querySelectorAll("a[data-accion]").forEach((enlace) => {
    enlace.addEventListener("click", (evento: Event) => {
      evento.preventDefault();
      const elemento = evento.currentTarget as HTMLAnchorElement;
      const id = elemento.dataset.id as string;
      const accion = elemento.dataset.accion;

      if (accion === "eliminar") {
        eliminarProducto(id);
      } else if (accion === "editar") {
        editarProducto(id);
      }
    });
  });
};

const eliminarProducto = (id: string): void => {
  const productos = obtenerProductos().filter((p) => p.id !== id);
  guardarProductos(productos);
  cargarTabla();
};

const editarProducto = (id: string): void => {
  const productos = obtenerProductos();
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  productoEditandoId = producto.id;
  inputNombre.value = producto.nombre;
  inputPrecio.value = String(producto.precio);
  selectCategoria.value = producto.categoria;
  textareaDescripcion.value = producto.descripcion;
  editorProducto.open = true;
  tituloEditor.textContent = "Editar Producto";
  botonGuardar.textContent = "Actualizar Producto";
  botonCancelar.hidden = false;
  inputNombre.focus();
};

const cancelarEdicion = (): void => {
  productoEditandoId = null;
  formulario.reset();
  tituloEditor.textContent = "Agregar Producto Rápido";
  botonGuardar.textContent = "Guardar Producto";
  botonCancelar.hidden = true;
};

formulario.addEventListener("submit", (evento: SubmitEvent) => {
  evento.preventDefault();

  const productos = obtenerProductos();
  const datosProducto = {
    nombre: inputNombre.value.trim(),
    descripcion: textareaDescripcion.value.trim(),
    precio: Number(inputPrecio.value),
    categoria: selectCategoria.value,
  };

  if (productoEditandoId) {
    const producto = productos.find((p) => p.id === productoEditandoId);
    if (!producto) return;
    Object.assign(producto, datosProducto);
    guardarProductos(productos);
  } else {
    const nuevoProducto: IProducto = {
      id: crypto.randomUUID(),
      ...datosProducto,
      imagen: "",
    };
    guardarProductos([...productos, nuevoProducto]);
  }

  cancelarEdicion();
  cargarTabla();
});

botonCancelar.addEventListener("click", cancelarEdicion);

logoutLink.addEventListener("click", (evento: MouseEvent) => {
  evento.preventDefault();
  cerrarSesion();
});

const sesion = obtenerSesion();
if (sesion) usuarioActual.textContent = `Sesión: ${sesion.email}`;

cargarTabla();
