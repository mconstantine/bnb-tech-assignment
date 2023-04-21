import { withDatabase } from "../database/database";
import { env } from "../env";

if (env.NODE_ENV === "production") {
  console.log("Cannot seed the production database, it would be crazy");
  process.exit();
}

(async () => {
  await withDatabase(async (db) => {
    await db.customer.truncate();
    await db.order.truncate();
    await db.product.truncate();

    const customer = await db.customer.create({
      name: "Some customer",
    });

    const order1 = await customer.createOrder();
    const order2 = await customer.createOrder();
    const order3 = await customer.createOrder();

    await customer.createOrder();

    const product1Data = {
      sku: "1234",
      name: "Product 1",
    };

    const product2Data = {
      sku: "2345",
      name: "Product 2",
    };

    const product3Data = {
      sku: "3456",
      name: "Product 3",
    };

    const product4Data = {
      sku: "4567",
      name: "Product 4",
    };

    await order1.createProduct({
      ...product1Data,
      quantity: 2,
      CustomerId: order1.CustomerId,
    });

    order1.createProduct({
      ...product2Data,
      quantity: 1,
      CustomerId: order1.CustomerId,
    });

    order1.createProduct({
      ...product3Data,
      quantity: 3,
      CustomerId: order1.CustomerId,
    });

    order1.createProduct({
      ...product4Data,
      quantity: 4,
      CustomerId: order1.CustomerId,
    });

    await order2.createProduct({
      ...product1Data,
      quantity: 1,
      CustomerId: order2.CustomerId,
    });

    await order2.createProduct({
      ...product1Data,
      quantity: 1,
      CustomerId: order2.CustomerId,
    });

    await order2.createProduct({
      ...product3Data,
      quantity: 4,
      CustomerId: order2.CustomerId,
    });

    await order2.createProduct({
      ...product2Data,
      quantity: 2,
      CustomerId: order3.CustomerId,
    });

    await order2.createProduct({
      ...product2Data,
      quantity: 2,
      CustomerId: order3.CustomerId,
    });

    await order2.createProduct({
      ...product4Data,
      quantity: 2,
      CustomerId: order3.CustomerId,
    });
  });
})().catch((e) => {
  console.log(e);
});
