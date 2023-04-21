import { ServerError } from "../ServerError";
import { withDatabase } from "../database/database";
import { Order } from "./makeOrderModel";

export async function setOrderDone(id: number): Promise<Order> {
  const order = await withDatabase((db) => db.order.findByPk(id));

  if (!order) {
    throw new ServerError(404, `Order with id ${id} not found`);
  }

  const products = await order.getProducts();

  await withDatabase((db) =>
    db.product.update(
      { status: "Done" },
      { where: { id: products.map((product) => product.id) } }
    )
  );

  return order;
}
