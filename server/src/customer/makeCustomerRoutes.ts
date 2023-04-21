import { Router } from "express";
import { getCustomer } from "./getCustomer";
import { makeEndpoint } from "../utils/makeEndpoint";
import { GetCustomerInput, GetCustomerOrdersInput } from "./domain";
import { getCustomerOrders } from "./getCustomerOrders";

export function makeCustomerRoutes(): Router {
  const router = Router();

  router.get("/:id", (req, res) =>
    makeEndpoint(GetCustomerInput, req.params, res, ({ id }) => getCustomer(id))
  );

  router.get("/:id/orders", (req, res) =>
    makeEndpoint(GetCustomerOrdersInput, req.params, res, ({ id }) =>
      getCustomerOrders(id)
    )
  );

  return router;
}
