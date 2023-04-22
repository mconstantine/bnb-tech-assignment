import { ServerError } from "../ServerError";
import { withDatabase } from "../database/database";
import { ProductStatusDone } from "../product/makeProductModel";
import { Order } from "./makeOrderModel";

export async function setOrderDone(id: number): Promise<Order> {
  const order = await withDatabase((db) =>
    db.order.findByPk(id, { include: db.product })
  );

  if (!order) {
    throw new ServerError(404, `Order with id ${id} not found`);
  }

  await withDatabase((db) =>
    db.product.update(
      { status: ProductStatusDone },
      { where: { id: order.Products!.map((product) => product.id) } }
    )
  );

  await order.setProducts(
    order.Products!.map((product) => {
      product.status = ProductStatusDone;
      return product;
    })
  );

  return await order.save();
}
