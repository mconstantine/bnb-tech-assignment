import { Sequelize } from "sequelize";
import { Customer, makeCustomerModel } from "../customer/makeCustomerModel";

export interface DatabaseContext {
  customer: typeof Customer;
}

export async function defineModels(
  sequelize: Sequelize
): Promise<DatabaseContext> {
  return {
    customer: makeCustomerModel(sequelize),
  };
}
