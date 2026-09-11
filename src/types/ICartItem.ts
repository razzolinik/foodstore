import { IProducto } from "./IProduct";

export interface ICartItem {
  producto: IProducto;
  cantidad: number;
}