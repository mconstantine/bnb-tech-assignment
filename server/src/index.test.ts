describe("Testing environment", () => {
  it("should work", () => {
    expect(process.env["NODE_ENV"]).toBe("test");
  });
});
