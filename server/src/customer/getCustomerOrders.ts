import { ServerError } from "../ServerError";
import { withDatabase } from "../database/database";
import { Order } from "../order/makeOrderModel";

export async function getCustomerOrders(customerId: number): Promise<Order[]> {
  const customer = await withDatabase((db) =>
    db.customer.findByPk(customerId, {
      include: db.order,
    })
  );

  if (!customer) {
    throw new ServerError(404, `Customer with id ${customerId} not found`);
  }

  return customer.Orders!;
}
