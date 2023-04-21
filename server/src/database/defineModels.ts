import { Sequelize } from "sequelize";
import { Customer, makeCustomerModel } from "../customer/makeCustomerModel";
import { Order, makeOrderModel } from "../order/makeOrderModel";
import { Product, makeProductModel } from "../product/makeProductModel";

export interface DatabaseContext {
  customer: typeof Customer;
  order: typeof Order;
  product: typeof Product;
}

export async function defineModels(
  sequelize: Sequelize
): Promise<DatabaseContext> {
  return {
    customer: makeCustomerModel(sequelize),
    order: makeOrderModel(sequelize),
    product: makeProductModel(sequelize),
  };
}
