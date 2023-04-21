import { ProductStatus } from "./productListSlice";

export interface UpdateProductInput {
  quantity: number;
  status: ProductStatus;
}
