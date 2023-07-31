import { Crud } from "./Crud";

export class DomAndEvents {
  constructor() {
    this.crud = new Crud();
  }

  createListener() {
    document
      .querySelector(".button_add")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
      });
  }

  updateListener() {
    document
      .querySelector(".button_update")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
      });
  }

  removeListener() {
    document
      .querySelector(".button_remove")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
      });
  }

  popupWindowListener() {}

  popupWindowCreater() {}
}
