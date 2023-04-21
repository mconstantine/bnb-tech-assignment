import { Sequelize } from "sequelize";
import { Customer, makeCustomerModel } from "../customer/makeCustomerModel";
import { Order, makeOrderModel } from "../order/makeOrderModel";

export interface DatabaseContext {
  customer: typeof Customer;
  order: typeof Order;
}

export async function defineModels(
  sequelize: Sequelize
): Promise<DatabaseContext> {
  return {
    customer: makeCustomerModel(sequelize),
    order: makeOrderModel(sequelize),
  };
}
