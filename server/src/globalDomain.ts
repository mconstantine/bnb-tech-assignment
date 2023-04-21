import z from "zod";

export const IdParams = z.object({
  id: z.coerce.number().int().min(1),
});
