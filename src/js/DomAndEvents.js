import { Crud } from "./Crud";
import { vault } from "./ItemAndVault";

export class DomAndEvents {
  constructor() {
    this.crud = new Crud();
    this.vault = vault;
  }

  onClickCreateButton() {
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
      if (
        event.target.classList.contains("update") &&
        event.target.closest(".table_row").dataset.id
      ) {
        const target_item = this.vault.find(
          (item) =>
            item.id === Number(event.target.closest(".table_row").dataset.id),
        );
        this.popupCreator(target_item.id, target_item.name, target_item.price);
      }
    };

    document
      .querySelector(".table")
      ?.addEventListener("click", updateButtonHandler);
  }

  onClickRemoveButton() {
    const removeButtonHandler = (event) => {
      event.preventDefault();
      if (
        event.target.classList.contains("remove") &&
        event.target.closest(".table_row").dataset.id
      ) {
        this.deletePopup(event.target.closest(".table_row"));
      }
    };

    document
      .querySelector(".table")
      ?.addEventListener("click", removeButtonHandler);
  }

  popupOnSubmit(id = null) {
    const popupWindowElement = document.querySelector(".form");
    const cancelButton = popupWindowElement.querySelector(".cancel-bnt");

    const popupWindowHandler = (event) => {
      event.preventDefault();
      if (id) {
        this.crud.update(
          id,
          event.target["item"].value,
          event.target.price.value,
        );
        const rowForChange = Array.from(
          document.querySelectorAll("tr[data-id]"),
        ).find((item) => Number(item.dataset.id) === id);
        rowForChange.querySelector(".item").textContent =
          event.target["item"].value;
        rowForChange.querySelector(".price").textContent =
          event.target.price.value;
      } else {
        this.crud.create(event.target["item"].value, event.target.price.value);

        const item = document.createElement("tr");
        item.classList.add("table_row");
        item.dataset.id = String(this.vault.at(-1).id);
        item.innerHTML = `
          <td class="item">${event.target["item"].value}</td>
          <td class="price">${event.target.price.value}</td>
          <td>
            <button class="update">✎</button>
            <button class="remove">X</button>
          </td>`;
        document.querySelector(".table").appendChild(item);
      }
      event.target["item"].value = "";
      event.target.price.value = "";

      this.popupCreator();
      popupWindowElement.removeEventListener("submit", popupWindowHandler);
      cancelButton.removeEventListener("click", popupCancelHandler);
    };

    const popupCancelHandler = (event) => {
      event.preventDefault();
      if (event.target === document.querySelector(".cancel-bnt")) {
        this.popupCreator();
        cancelButton.removeEventListener("click", popupCancelHandler);
        popupWindowElement.removeEventListener("submit", popupWindowHandler);
      }
    };

    popupWindowElement.addEventListener("submit", popupWindowHandler);
    cancelButton?.addEventListener("click", popupCancelHandler);
  }

  popupCreator(id = null, name = null, price = null) {
    const popupWindow = document.querySelector(".popup_window");

    if (!popupWindow) {
      const popupWindow = document.createElement("div");
      popupWindow.classList.add("popup_window", "shown");
      popupWindow.innerHTML = `
      <form class="form">
        <h2>Название</h2>
        <input type="text" name="item">
        <h2>Стоимость</h2>
        <input type="text" name="price">
        <div class="form_buttons">
          <button class="submit-btn" type="submit">Сохранить</button>
          <button class="cancel-bnt" type="button">Отмена</button>
        </div>
      </form>`;
      document.body.appendChild(popupWindow);
    } else {
      popupWindow.classList.toggle("shown");
    }

    if (document.querySelector(".popup_window")?.classList.contains("shown")) {
      document.querySelector("input[name='item']").focus();
      if (id) {
        popupWindow.querySelector("input[name='item']").value = name;
        popupWindow.querySelector("input[name='price']").value = price;
        this.popupOnSubmit(id);
      } else {
        this.popupOnSubmit();
      }
    }
  }

  deletePopupOnSubmit(itemForDelete) {
    const deletePopupElement = document.querySelector(".form-delete");
    const cancelDeleteButton = deletePopupElement.querySelector(".cancel-bnt");

    const popupWindowHandler = (event) => {
      event.preventDefault();

      if (itemForDelete) {
        this.crud.remove(Number(itemForDelete.dataset.id));
        itemForDelete.remove();
      }

      this.deletePopup();

      deletePopupElement.removeEventListener("submit", popupWindowHandler);
      cancelDeleteButton.removeEventListener("click", deletPopupCancelHandler);
    };

    const deletPopupCancelHandler = (event) => {
      event.preventDefault();
      if (event.target === deletePopupElement.querySelector(".cancel-bnt")) {
        this.deletePopup();
        cancelDeleteButton.removeEventListener(
          "click",
          deletPopupCancelHandler,
        );
        deletePopupElement.removeEventListener("submit", popupWindowHandler);
      }
    };

    deletePopupElement.addEventListener("submit", popupWindowHandler);
    cancelDeleteButton.addEventListener("click", deletPopupCancelHandler);
  }

  deletePopup(itemForDelete) {
    const popupDelete = document.querySelector(".popup_delete");
    if (!popupDelete) {
      const popupWindow = document.createElement("div");
      popupWindow.classList.add("popup_delete", "shown");
      popupWindow.innerHTML = `
      <form class="form-delete">
        <h2>Вы уверены, что хотите удалить этот товар?</h2>
        <div class="form_buttons">
          <button class="submit-btn" type="submit">Да</button>
          <button class="cancel-bnt" type="button">Отмена</button>
        </div>
      </form>`;
      document.body.appendChild(popupWindow);
    } else {
      popupDelete.classList.toggle("shown");
    }
    if (itemForDelete) {
      this.deletePopupOnSubmit(itemForDelete);
    }
  }
}
