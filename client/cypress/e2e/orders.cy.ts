describe("orders view", () => {
  it("should have a view", () => {
    cy.intercept({
      url: "/customers/1/orders/",
      method: "GET",
    }).as("fetchOrders");

    cy.visit("/");
    cy.findByRole("heading", { name: "Your Orders" }).should("exist");
    cy.wait("@fetchOrders");
  });

  it("should update product quantity", () => {
    cy.intercept({
      url: "/products/*/",
      method: "PATCH",
    }).as("updateProduct");

    cy.visit("/");

    const findFirstPlusButton = () =>
      cy.findAllByRole("button", { name: "+" }).first();

    const findFirstNumberInput = () => findFirstPlusButton().prev();

    findFirstNumberInput().clear().blur();
    findFirstNumberInput().should("have.value", "0");
    findFirstPlusButton().click().click().click();
    findFirstNumberInput().should("have.value", "3");

    cy.findAllByRole("button", { name: "Save" }).first().click();

    cy.wait("@updateProduct").then((interception) => {
      assert.containsAllKeys(interception.request.body, ["quantity"]);
      assert.equal(interception.request.body.quantity, 3);
    });
  });
});
