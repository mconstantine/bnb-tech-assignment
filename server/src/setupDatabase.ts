import { Sequelize } from "sequelize";
import { env } from "./env";

export async function setupDatabase() {
  const sequelize = (() => {
    switch (env.NODE_ENV) {
      case "production":
        return new Sequelize({
          dialect: "sqlite",
          storage: "data/database.sqlite",
        });
      default:
        return new Sequelize("sqlite::memory:", {
          logging: env.DB_LOGGING && console.log,
        });
    }
  })();

  await sequelize.authenticate();
  return sequelize;
}
