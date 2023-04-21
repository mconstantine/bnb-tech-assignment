import { Router } from "express";
import { UpdateProductInput, UpdateProductParams } from "./domain";
import { handleParseError, makeEndpoint } from "../utils/makeEndpoint";
import { updateProduct } from "./updateProduct";

export function makeProductRoutes(): Router {
  const router = Router();

  router.put("/:id", (req, res) => {
    const paramsParseResult = UpdateProductParams.safeParse(req.params);

    if (paramsParseResult.success) {
      const id = paramsParseResult.data.id;

      return makeEndpoint(UpdateProductInput, req.body, res, (data) =>
        updateProduct(id, data)
      );
    } else {
      return handleParseError(paramsParseResult, res);
    }
  });

  return router;
}
