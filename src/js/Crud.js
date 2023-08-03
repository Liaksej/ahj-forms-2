import { Item } from "./ItemAndVault";
import { vault } from "./ItemAndVault";

export class Crud {
  create(name, price) {
    const item = new Item(name, price);
    vault.push(item);
  }

  update(id, name, price) {
    const item = vault.find((item) => item.id === id);
    if (item) {
      item.name = name;
      item.price = Number(price);
    } else {
      throw new Error("Item not found");
    }
  }

  remove(id) {
    const item = vault.find((item) => item.id === id);
    if (item) {
      vault.splice(vault.indexOf(item), 1);
    } else {
      throw new Error("Item not found");
    }
  }
}
