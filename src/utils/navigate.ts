// Single place that touches window.location, so every redirect in the
// app is consistent and easy to change later.
export function redirigirA(ruta: string): void {
  window.location.href = ruta;
}
