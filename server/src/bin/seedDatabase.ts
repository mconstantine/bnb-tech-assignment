import { withDatabase } from "../database/database";
import { env } from "../env";

if (env.NODE_ENV === "production") {
  console.log("Cannot seed the production database, it would be crazy");
  process.exit();
}

(async () => {
  await withDatabase(async (db) => {
    await db.customer.truncate();
    await db.customer.create({
      name: "Some customer",
    });
  });
})().catch((e) => {
  console.log(e);
});
