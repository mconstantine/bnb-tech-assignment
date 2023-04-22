describe("products view", () => {
  it("should have a view", () => {
    cy.intercept({
      url: "/customers/1/products/",
      method: "GET",
    }).as("fetchProducts");

    cy.visit("/");

    cy.findByRole("navigation")
      .findByText(/products/i)
      .click();

    cy.wait("@fetchProducts");
  });

  it.only("should update product status", () => {
    cy.intercept({
      url: "/products/*/",
      method: "PATCH",
    }).as("updateProducts");

    cy.visit("/");

    cy.findByRole("navigation")
      .findByText(/products/i)
      .click();

    cy.findAllByRole("combobox").first().select("Done");
    cy.findAllByRole("button", { name: "Save" }).first().click();

    cy.wait("@updateProducts").then((interception) => {
      assert.containsAllKeys(interception.request.body, ["status"]);
      assert.equal(interception.request.body.status, "Done");
    });
  });
});
