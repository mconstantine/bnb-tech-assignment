import { ServerError } from "../ServerError";
import { withDatabase } from "../database/database";
import { Order } from "./makeOrderModel";

export async function setOrderDone(id: number): Promise<Order> {
  const order = await withDatabase((db) =>
    db.order.findByPk(id, { include: db.product })
  );

  if (!order) {
    throw new ServerError(404, `Order with id ${id} not found`);
  }

  await order.setProducts(
    order.Products!.map((product) => {
      product.status = "Done";
      return product;
    })
  );

  return order;
}
