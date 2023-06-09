import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { Customer } from "../customer/makeCustomerModel";
import { Product } from "../product/makeProductModel";

export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare CustomerId: ForeignKey<Customer["id"]>;
  declare Customer?: NonAttribute<Customer>;

  declare getProducts: HasManyGetAssociationsMixin<Product>;
  declare addProduct: HasManyAddAssociationMixin<Product, number>;
  declare addProducts: HasManyAddAssociationsMixin<Product, number>;
  declare setProducts: HasManySetAssociationsMixin<Product, number>;
  declare removeProduct: HasManyRemoveAssociationMixin<Product, number>;
  declare removeProducts: HasManyRemoveAssociationsMixin<Product, number>;
  declare hasProduct: HasManyHasAssociationMixin<Product, number>;
  declare hasProducts: HasManyHasAssociationsMixin<Product, number>;
  declare countProducts: HasManyCountAssociationsMixin;
  declare createProduct: HasManyCreateAssociationMixin<Product, "OrderId">;
  declare Products?: NonAttribute<Product[]>;

  declare static associations: {
    products: Association<Order, Product>;
  };
}

export function makeOrderModel(sequelize: Sequelize) {
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
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

  Customer.hasMany(Order);
  Order.belongsTo(Customer);

  return Order;
}
