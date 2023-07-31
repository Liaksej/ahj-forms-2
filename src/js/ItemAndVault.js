export const vault = [];

export class Item {
  constructor(name, price) {
    this.id = Date.now();
    this.name = name;
    this.price = price;
  }
}
