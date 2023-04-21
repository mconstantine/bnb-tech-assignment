import { ServerError } from "../ServerError";
import { withDatabase } from "../database/database";
import { UpdateOrderInput } from "./domain";
import { Order } from "./makeOrderModel";

export async function updateOrder(
  id: number,
  data: UpdateOrderInput
): Promise<Order> {
  const order = await withDatabase((db) => db.order.findByPk(id));

  if (!order) {
    throw new ServerError(404, `Order with id ${id} not found`);
  }

  return await order.update(data);
}
