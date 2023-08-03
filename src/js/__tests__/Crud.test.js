import { Crud } from "../Crud";
import { vault } from "../ItemAndVault";

describe("Crud", () => {
  let crud;

  beforeEach(() => {
    crud = new Crud();
  });

  afterEach(() => {
    vault.length = 0;
  });

  test("should create a new item", () => {
    crud.create("Apple", 10);
    const item = vault[0];
    expect([item.constructor.name, item.name, item.price]).toEqual([
      "Item",
      "Apple",
      10,
    ]);
  });

  test("should update an existing item", () => {
    crud.create("Apple", 10);

    const itemId = vault[0].id;
    crud.update(itemId, "Banana", 20);

    const item = vault[0];

    expect([item.name, item.price]).toEqual(["Banana", 20]);
  });

  test("should throw an error if item to update is not found", () => {
    expect(() => {
      crud.update(1, "Banana", 20);
    }).toThrow("Item not found");
  });

  test("should delete an item by id", () => {
    crud.create("Apple", 10);
    const itemId = vault[0].id;

    crud.remove(itemId);

    expect(vault).toHaveLength(0);
  });

  test("should throw an error if item to delete is not found", () => {
    expect(() => {
      crud.remove(1);
    }).toThrow("Item not found");
  });
});
