import { ServerError } from "../ServerError";
import { withDatabase } from "../database/database";
import { Product } from "../product/makeProductModel";

export async function getCustomerProducts(
  customerId: number
): Promise<Product[]> {
  const customer = await withDatabase((db) =>
    db.customer.findByPk(customerId, {
      include: Product,
    })
  );

  if (!customer) {
    throw new ServerError(404, `Customer with id ${customerId} not found`);
  }

  return customer.Products!;
}
