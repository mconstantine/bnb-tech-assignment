import { Router } from "express";
import { getCustomer } from "./getCustomer";
import { makeEndpoint } from "../utils/makeEndpoint";
import {
  GetCustomerParams,
  GetCustomerOrdersParams,
  GetCustomerProductsParams,
} from "./domain";
import { getCustomerOrders } from "./getCustomerOrders";
import { getCustomerProducts } from "./getCustomerProducts";

export function makeCustomerRoutes(): Router {
  const router = Router();

  router.get("/:id", (req, res) =>
    makeEndpoint(GetCustomerParams, req.params, res, ({ id }) =>
      getCustomer(id)
    )
  );

  router.get("/:id/orders", (req, res) =>
    makeEndpoint(GetCustomerOrdersParams, req.params, res, ({ id }) =>
      getCustomerOrders(id)
    )
  );

  router.get("/:id/products", (req, res) =>
    makeEndpoint(GetCustomerProductsParams, req.params, res, ({ id }) =>
      getCustomerProducts(id)
    )
  );

  return router;
}
