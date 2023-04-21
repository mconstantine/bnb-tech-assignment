import { ServerError } from "../ServerError";
import { withDatabase } from "../database/database";
import { UpdateProductInput } from "./domain";
import { Product } from "./makeProductModel";

export async function updateProduct(
  id: number,
  data: UpdateProductInput
): Promise<Product> {
  const product = await withDatabase((db) => db.product.findByPk(id));

  if (!product) {
    throw new ServerError(404, `Product with id ${id} not found`);
  }

  return product.update(data);
}
