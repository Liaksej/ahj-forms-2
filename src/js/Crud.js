import { Item } from "./ItemAndVault";
import { vault } from "./ItemAndVault";

export class Crud {
  create(name, price) {
    const item = new Item(name, price);
    vault.push(item);
    return item.id;
  }

  update(id, name, price) {
    const item = vault.find((item) => item.id === id);
    if (item) {
      item.name = name;
      item.price = price;
      return item;
    }
    return null;
  }

  remove(id) {
    const item = vault.find((item) => item.id === id);
    vault.splice(vault.indexOf(item), 1);
    return item;
  }
}
