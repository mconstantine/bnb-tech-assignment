import { ServerError } from "../ServerError";
import { withDatabase } from "../database/database";
import { UpdateOrderInput } from "./domain";
import { Order } from "./makeOrderModel";

export function updateOrder(
  id: number,
  data: UpdateOrderInput
): Promise<Order> {
  return withDatabase(async (db) => {
    const order = await db.order.findByPk(id);

    if (!order) {
      throw new ServerError(404, `Order with id ${id} not found`);
    }

    return await order.update(data);
  });
}
