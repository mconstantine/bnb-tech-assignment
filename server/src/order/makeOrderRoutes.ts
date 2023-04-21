import { Router } from "express";
import { UpdateOrderInput, UpdateOrderParams } from "./domain";
import { makeEndpoint } from "../utils/makeEndpoint";
import { updateOrder } from "./updateOrder";

export function makeOrderRoutes(): Router {
  const router = Router();

  router.put("/:id", (req, res) => {
    const paramsParseResult = UpdateOrderParams.safeParse(req.params);

    if (paramsParseResult.success) {
      const id = paramsParseResult.data.id;

      return makeEndpoint(UpdateOrderInput, req.body, res, (data) =>
        updateOrder(id, data)
      );
    } else {
      return res.status(422).end();
    }
  });

  return router;
}
