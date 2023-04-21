import {
  Association,
  CreationOptional,
  DataTypes,
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
import { Order } from "../order/makeOrderModel";
import { Product } from "../product/makeProductModel";

export class Customer extends Model<
  InferAttributes<Customer>,
  InferCreationAttributes<Customer>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getOrders: HasManyGetAssociationsMixin<Order>;
  declare addOrder: HasManyAddAssociationMixin<Order, number>;
  declare addOrders: HasManyAddAssociationsMixin<Order, number>;
  declare setOrders: HasManySetAssociationsMixin<Order, number>;
  declare removeOrder: HasManyRemoveAssociationMixin<Order, number>;
  declare removeOrders: HasManyRemoveAssociationsMixin<Order, number>;
  declare hasOrder: HasManyHasAssociationMixin<Order, number>;
  declare hasOrders: HasManyHasAssociationsMixin<Order, number>;
  declare countOrders: HasManyCountAssociationsMixin;
  declare createOrder: HasManyCreateAssociationMixin<Order, "CustomerId">;
  declare Orders?: NonAttribute<Order[]>;
  declare Products?: NonAttribute<Product[]>;

  declare static associations: {
    orders: Association<Customer, Order>;
    products: Association<Customer, Product>;
  };
}

export function makeCustomerModel(sequelize: Sequelize) {
  Customer.init(
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
    }
  );

  return Customer;
}
