import { Sequelize } from "sequelize";
import { env } from "../env";
import { DatabaseContext, defineModels } from "./defineModels";

export interface DatabaseRow {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Database {
  sequelize: Sequelize;
  models: DatabaseContext;
}

let _database: Database | null = null;

async function initDatabaseSingleton(): Promise<Database> {
  if (!_database) {
    const sequelize = (() => {
      switch (env.NODE_ENV) {
        case "development":
        case "production":
          return new Sequelize({
            dialect: "sqlite",
            storage: "data/database.sqlite",
          });
        case "test":
        default:
          return new Sequelize("sqlite::memory:", {
            logging: env.DB_LOGGING && console.log,
          });
      }
    })();

    await sequelize.authenticate();

    _database = {
      sequelize,
      models: await defineModels(sequelize),
    };

    await _database.sequelize.sync({
      alter: env.NODE_ENV === "development" || env.NODE_ENV === "test",
    });
  }

  return _database;
}

export async function getDatabase(): Promise<Sequelize> {
  const database = await initDatabaseSingleton();
  return database.sequelize;
}

export async function withDatabase<T>(
  callback: (db: DatabaseContext) => Promise<T>
): Promise<T> {
  const database = await initDatabaseSingleton();
  return callback(database.models);
}
