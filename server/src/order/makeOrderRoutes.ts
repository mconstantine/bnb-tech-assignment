import { Router } from "express";
import { UpdateOrderInput, UpdateOrderParams } from "./domain";
import { handleParseError, makeEndpoint } from "../utils/makeEndpoint";
import { updateOrder } from "./updateOrder";

export function makeOrderRoutes(): Router {
  const router = Router();

  router.patch("/:id", (req, res) => {
    const paramsParseResult = UpdateOrderParams.safeParse(req.params);

    if (paramsParseResult.success) {
      const id = paramsParseResult.data.id;

      return makeEndpoint(UpdateOrderInput, req.body, res, (data) =>
        updateOrder(id, data)
      );
    } else {
      return handleParseError(paramsParseResult, res);
    }
  });

  return router;
}
