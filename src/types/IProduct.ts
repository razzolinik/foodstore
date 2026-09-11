// Product record, same shape the original data.js used, now persisted
// in localStorage instead of a hardcoded array.
export interface IProducto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
}
