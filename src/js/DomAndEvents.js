import { Crud } from "./Crud";
import { vault } from "./ItemAndVault";
import { Tooltip } from "./tooltipFabric";

export class DomAndEvents {
  constructor() {
    this.crud = new Crud();
    this.tooltip = new Tooltip();
    this.vault = vault;
    this.actualMessages = [];
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

  popupOnSubmit(event, id = null) {
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
  }

  popupCreator(id = null, name = null, price = null) {
    const popupWindow = document.querySelector(".popup_window");

    if (!popupWindow) {
      const popupWindow = document.createElement("div");
      popupWindow.classList.add("popup_window", "shown");
      popupWindow.innerHTML = `
      <form class="form" novalidate>
        <h2>Название</h2>
        <input type="text" name="item" required>
        <h2>Стоимость</h2>
        <input type="text" name="price" required pattern="^[1-9][0-9]*$">
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
        this.tooltipLogic(id);
      } else {
        this.tooltipLogic();
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
      cancelDeleteButton.removeEventListener("click", deletePopupCancelHandler);
    };

    const deletePopupCancelHandler = (event) => {
      event.preventDefault();
      if (event.target === deletePopupElement.querySelector(".cancel-bnt")) {
        this.deletePopup();
        cancelDeleteButton.removeEventListener(
          "click",
          deletePopupCancelHandler,
        );
        deletePopupElement.removeEventListener("submit", popupWindowHandler);
      }
    };

    deletePopupElement.addEventListener("submit", popupWindowHandler);
    cancelDeleteButton.addEventListener("click", deletePopupCancelHandler);
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

  tooltipLogic(elementID = null) {
    const form = document.querySelector(".form");
    const cancelButton = form.querySelector(".cancel-bnt");

    const errors = {
      item: {
        valueMissing: "Нам потребуется название...",
      },
      price: {
        valueMissing: "Нам потребуется стоимость...",
        patternMismatch: "Цена должна быть положительным числом",
      },
    };

    const showTooltip = (message, el) => {
      this.actualMessages.push({
        name: el.name,
        id: this.tooltip.showTooltip(message, el),
      });
    };

    const getError = (el) => {
      const errorKey = Object.keys(ValidityState.prototype).find((key) => {
        if (!el.name) return;
        if (key === "valid") return;

        return el.validity[key];
      });

      if (!errorKey) return;

      return errors[el.name][errorKey];
    };

    const popupCancelHandler = (event) => {
      event.preventDefault();
      if (event.target === document.querySelector(".cancel-bnt")) {
        this.popupCreator();

        this.actualMessages.forEach((message) =>
          this.tooltip.removeTooltip(message.id),
        );
        this.actualMessages = [];

        cancelButton.removeEventListener("click", popupCancelHandler);
        form.removeEventListener("submit", formSubmitEventHandler);
      }
    };

    cancelButton.addEventListener("click", popupCancelHandler);

    const formSubmitEventHandler = (e) => {
      e.preventDefault();

      this.actualMessages.forEach((message) =>
        this.tooltip.removeTooltip(message.id),
      );
      this.actualMessages = [];

      const elements = form.elements;

      Array.from(elements).some((elem) => {
        const error = getError(elem);

        if (error) {
          showTooltip(error, elem);
          return true;
        }
        return false;
      });

      if (form.checkValidity()) {
        console.log("valid");
        console.log("submit");

        this.popupOnSubmit(e, elementID);
        cancelButton.removeEventListener("click", popupCancelHandler);
        form.removeEventListener("submit", formSubmitEventHandler);
        Array.from(form.elements).forEach((el) =>
          el.removeEventListener("focus", elementBlurCallback),
        );
      }
    };

    form.addEventListener("submit", formSubmitEventHandler);

    const elementOnBlur = (e) => {
      const el = e.target;

      const error = getError(el);

      const currentErrorMessage = this.actualMessages.find(
        (item) => item.name === el.name,
      );

      if (error) {
        if (!currentErrorMessage) {
          showTooltip(error, el);
        }
      } else {
        if (currentErrorMessage) {
          this.tooltip.removeTooltip(currentErrorMessage.id);
          this.actualMessages.splice(
            this.actualMessages.indexOf(currentErrorMessage.id),
            1,
          );
        }
      }
    };

    const elementBlurCallback = (el) =>
      el.addEventListener("blur", elementOnBlur);

    Array.from(form.elements).forEach((el) =>
      el.addEventListener("focus", elementBlurCallback(el)),
    );
  }
}
