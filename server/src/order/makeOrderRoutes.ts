import { Router } from "express";
import { UpdateOrderParams } from "./domain";
import { makeEndpoint } from "../utils/makeEndpoint";
import { setOrderDone } from "./setOrderDone";

export function makeOrderRoutes(): Router {
  const router = Router();

  router.patch("/:id/done", (req, res) =>
    makeEndpoint(UpdateOrderParams, req.params, res, ({ id }) =>
      setOrderDone(id)
    )
  );

  return router;
}
