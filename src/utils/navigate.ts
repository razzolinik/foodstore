export function resolverRuta(ruta: string): string {
  const limpia = ruta.replace(/^\/+/, "");
  const indice = window.location.pathname.indexOf("/src/");
  const raiz = indice === -1 ? "/" : window.location.pathname.slice(0, indice + 1);
  return raiz + limpia;
}

export function redirigirA(ruta: string): void {
  window.location.href = resolverRuta(ruta);
}