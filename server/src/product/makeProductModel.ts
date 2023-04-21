import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { Order } from "../order/makeOrderModel";
import { Customer } from "../customer/makeCustomerModel";

export const ProductStatusProcessing = "Processing";
export const ProductStatusDone = "Done";
export type ProductStatus =
  | typeof ProductStatusProcessing
  | typeof ProductStatusDone;

export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare sku: string;
  declare quantity: number;
  declare status: CreationOptional<ProductStatus>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare OrderId: ForeignKey<Order["id"]>;
  declare Order?: NonAttribute<Order>;
  declare CustomerId: ForeignKey<Customer["id"]>;
  declare Customer?: NonAttribute<Customer>;
}

export function makeProductModel(sequelize: Sequelize) {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(127),
        allowNull: false,
      },
      sku: {
        type: new DataTypes.STRING(255),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(ProductStatusProcessing, ProductStatusDone),
        defaultValue: ProductStatusProcessing,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      defaultScope: {
        attributes: {
          exclude: ["CustomerId"],
        },
      },
    }
  );

  Order.hasMany(Product);
  Product.belongsTo(Order);

  Customer.hasMany(Product);
  Product.belongsTo(Customer);

  return Product;
}
