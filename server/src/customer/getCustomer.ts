import { ServerError } from "../ServerError";
import { withDatabase } from "../database/database";
import { Customer } from "./makeCustomerModel";

export async function getCustomer(id: number): Promise<Customer> {
  const customer = await withDatabase((db) => db.customer.findByPk(id));

  if (!customer) {
    throw new ServerError(404, `Customer with id ${id} not found`);
  }

  return customer;
}
