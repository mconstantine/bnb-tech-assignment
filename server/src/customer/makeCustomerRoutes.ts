import { Router } from "express";
import { getCustomer } from "./getCustomer";
import { makeEndpoint } from "../utils/makeEndpoint";
import { GetCustomerInput } from "./domain";

export function makeCustomerRoutes(): Router {
  const router = Router();

  router.get("/:id", (req, res) =>
    makeEndpoint(GetCustomerInput, req.params, res, ({ id }) => getCustomer(id))
  );

  return router;
}
