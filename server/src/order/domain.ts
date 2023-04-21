import z from "zod";
import { IdParams } from "../globalDomain";
import { OrderStatusDone, OrderStatusProcessing } from "./makeOrderModel";

export const UpdateOrderParams = IdParams;

export const UpdateOrderInput = z.object({
  status: z.enum([OrderStatusProcessing, OrderStatusDone]),
});
export type UpdateOrderInput = z.infer<typeof UpdateOrderInput>;
