import { Crud } from "./Crud";

export class DomAndEvents {
  constructor() {
    this.crud = new Crud();
  }

  onClickCreateButton() {
    const createButtonHandler = (event) => {
      event.preventDefault();
      if (event.target.dataset.id) {
        this.popupCreator();
      }
    };

    document
      .querySelector(".button_add")
      ?.addEventListener("click", createButtonHandler);

    document
      .querySelector(".button_add")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
        if (!document.querySelector(".popup_window.shown")) {
          this.popupCreator();
        }
      });
  }

  onClickUpdateButton() {
    const updateButtonHandler = (event) => {
      event.preventDefault();
      if (event.target.dataset.id) {
        this.popupCreator(
          event.target.dataset.id,
          event.target.name.value,
          event.target.price.value,
        );
      }
    };

    document
      .querySelector(".form")
      ?.addEventListener("click", updateButtonHandler);
  }

  onClickRemoveButton() {
    const removeButtonHandler = (event) => {
      event.preventDefault();
      if (event.target.dataset.id) {
        this.crud.remove(event.target.dataset.id);
      }
    };

    document
      .querySelector(".form")
      ?.addEventListener("click", removeButtonHandler);
  }

  popupOnSubmit(id = null) {
    const popupWindowElement = document.querySelector(".popup_window");

    const popuWindowHandler = (event) => {
      event.preventDefault();
      if (id) {
        this.crud.update(id, event.target.name.value, event.target.price.value);
        Array.from(document.querySelector(".item")).find((item) => {
          if (item.dataset.id === id) {
            item.querySelector(".name").textContent = event.target.name.value;
            item.querySelector(".price").textContent = event.target.price.value;
          }
        });
      } else {
        this.crud.create(event.target.name.value, event.target.price.value);

        const item = document.createElement("tr");
        item.dataset.id = this.vault.slice(-1).id;
        item.innerHTML = `
          <td>${event.target.name.value}</td>
          <td>${event.target.price.value}</td>
          <td>
            <button class="update">Обн.</button>
            <button class="remove">X</button>
          </td>`;
        document.querySelector(".table").appendChild(item);
      }
      popupWindowElement.removeEventListener("submit", popuWindowHandler);
      popupWindowElement.removeEventListener("click", popupCancelHandler);
    };

    popupWindowElement?.addEventListener("submit", popuWindowHandler);

    const popupCancelHandler = (event) => {
      event.preventDefault();
      if (event.target === document.querySelector(".cancel-bnt")) {
        this.popupCreator();
        popupWindowElement.removeEventListener("click", popupCancelHandler);
        popupWindowElement.removeEventListener("submit", popuWindowHandler);
      }
    };

    popupWindowElement?.addEventListener("click", popupCancelHandler);
  }

  popupCreator(id = null, name = null, price = null) {
    const popupWindow = document.querySelector(".popup_window");

    if (!popupWindow) {
      const popupWindow = document.createElement("div");
      popupWindow.classList.add("popup_window", "shown");
      popupWindow.innerHTML = `
      <form>
        <h2>Название</h2>
        <input type="text" name="name">
        <h2>Стоимость</h2>
        <input type="text" name="price">
        <button type="submit">Сохранить</button>
        <button class="cancel-bnt" type="button">Отмена</button>
      </form>`;
      document.body.appendChild(popupWindow);
      this.popupOnSubmit(id);
    } else {
      popupWindow.classList.toggle("shown");
    }

    if (popupWindow?.classList.contains("shown")) {
      if (id) {
        popupWindow.querySelector("input[name='name']").value = name;
        popupWindow.querySelector("input[name='price']").value = price;
        this.popupOnSubmit(id);
      } else {
        this.popupOnSubmit();
      }
    }
  }
}
