import z from "zod";
import { IdParams } from "../globalDomain";
import { ProductStatusDone, ProductStatusProcessing } from "./makeProductModel";

export const UpdateProductParams = IdParams;

export const UpdateProductInput = z.object({
  status: z.enum([ProductStatusProcessing, ProductStatusDone]),
  quantity: z.number().int().min(1),
});
export type UpdateProductInput = z.infer<typeof UpdateProductInput>;
