export const productStatusProcessing = "Processing";
export const productStatusDone = "Done";

export type ProductStatus =
  | typeof productStatusProcessing
  | typeof productStatusDone;

export interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  status: ProductStatus;
}
