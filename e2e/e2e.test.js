import puppeteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(30000); // default puppeteer timeout

describe("Валидируем основной функционал", () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = "http://localhost:9000";

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("message", (message) => {
        if (message === "ok") {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      // headless: false, // show gui
      slowMo: 100,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test("Работа кнопки +", async () => {
    await page.goto(baseUrl);

    const mainContainer = await page.$(".above_container");
    const button = await mainContainer.$(".button_add");

    await button.click();

    const openedForm = await page.evaluate(() => {
      if (document.querySelector(".form")) {
        return true;
      }
    });

    await expect(openedForm).toBe(true);
  });

  test("Работа формы - добавление элемента в CRM", async () => {
    await page.goto(baseUrl);

    const mainContainer = await page.$(".main_container");
    const button = await mainContainer.$(".button_add");

    await button.click();

    const form = await page.$(".form");
    const buttonSubmit = await form.$(".submit-btn");
    const input_name = await form.$("input[name='item']");
    const input_price = await form.$("input[name='price']");

    await input_name.type("iphone");
    await input_price.type("100");

    await buttonSubmit.click();

    const newItem = await page.evaluate(() => {
      if (
        document.querySelector(".item").textContent === "iphone" &&
        document.querySelector(".price").textContent === "100"
      ) {
        return true;
      }
    });

    await expect(newItem).toBe(true);
  });

  test("Работа формы - кнопка отмена", async () => {
    await page.goto(baseUrl);

    const mainContainer = await page.$(".main_container");
    const button = await mainContainer.$(".button_add");

    await button.click();

    const form = await page.$(".form");
    const buttonSubmit = await form.$(".cancel-bnt");
    const inputName = await form.$("input[name='item']");
    const inputPrice = await form.$("input[name='price']");

    await inputName.type("iphone");
    await inputPrice.type("100");

    await buttonSubmit.click();

    const newItem = await page.evaluate(() => {
      return (
        document.querySelector(".item")?.textContent === "iphone" &&
        document.querySelector(".price")?.textContent === "100"
      );
    });

    await expect(newItem).toBe(false);
  });

  test("Работа кнопок таблицы - кнопка редактирования", async () => {
    await page.goto(baseUrl);

    const mainContainer = await page.$(".main_container");
    const button = await mainContainer.$(".button_add");

    await button.click();

    const form = await page.$(".form");
    const buttonSubmit = await form.$(".submit-btn");
    const inputName = await form.$("input[name='item']");
    const inputPrice = await form.$("input[name='price']");

    await inputName.type("iphone");
    await inputPrice.type("100");

    await buttonSubmit.click();

    const updateButton = await page.$(".update");

    await updateButton.click();

    const newItem = await page.evaluate(() => {
      return (
        document.querySelector("input[name='item']").value === "iphone" &&
        document.querySelector("input[name='price']").value === "100"
      );
    });

    await expect(newItem).toBe(true);
  });

  test("Работа кнопок таблицы - кнопка удаления", async () => {
    await page.goto(baseUrl);

    const mainContainer = await page.$(".main_container");
    const button = await mainContainer.$(".button_add");

    await button.click();

    const form = await page.$(".form");
    const buttonSubmit = await form.$(".submit-btn");
    const inputName = await form.$("input[name='item']");
    const inputPrice = await form.$("input[name='price']");

    await inputName.type("iphone");
    await inputPrice.type("100");

    await buttonSubmit.click();

    const updateButton = await page.$(".remove");

    await updateButton.click();

    const newItem = await page.evaluate(() => {
      return document
        .querySelector(".popup_delete")
        .classList.contains("shown");
    });

    await expect(newItem).toBe(true);
  });

  test("Работа формы удаления - кнопка Да", async () => {
    await page.goto(baseUrl);

    const mainContainer = await page.$(".main_container");
    const button = await mainContainer.$(".button_add");

    await button.click();

    const form = await page.$(".form");
    const buttonSubmit = await form.$(".submit-btn");
    const inputName = await form.$("input[name='item']");
    const inputPrice = await form.$("input[name='price']");

    await inputName.type("iphone");
    await inputPrice.type("100");

    await buttonSubmit.click();

    const updateButton = await page.$(".remove");

    await updateButton.click();

    const popupDelete = await page.$(".popup_delete");
    const yesBtn = await popupDelete.$(".submit-btn");

    await yesBtn.click();

    const newItem = await page.evaluate(() => {
      return (
        document.querySelector(".item")?.textContent === "iphone" &&
        document.querySelector(".price")?.textContent === "100"
      );
    });

    await expect(newItem).toBe(false);
  });

  test("Работа формы удаления - кнопка Отмена", async () => {
    await page.goto(baseUrl);

    const mainContainer = await page.$(".main_container");
    const button = await mainContainer.$(".button_add");

    await button.click();

    const form = await page.$(".form");
    const buttonSubmit = await form.$(".submit-btn");
    const inputName = await form.$("input[name='item']");
    const inputPrice = await form.$("input[name='price']");

    await inputName.type("iphone");
    await inputPrice.type("100");

    await buttonSubmit.click();

    const updateButton = await page.$(".remove");

    await updateButton.click();

    const popupDelete = await page.$(".popup_delete");
    const cancelBtn = await popupDelete.$(".cancel-bnt");

    await cancelBtn.click();

    const newItem = await page.evaluate(() => {
      return (
        document.querySelector(".item")?.textContent === "iphone" &&
        document.querySelector(".price")?.textContent === "100"
      );
    });

    await expect(newItem).toBe(true);
  });

  test("Появление тултипа названия товара", async () => {
    await page.goto(baseUrl);

    const mainContainer = await page.$(".main_container");
    const button = await mainContainer.$(".button_add");

    await button.click();

    const form = await page.$(".form");
    const buttonSubmit = await form.$(".submit-btn");
    const inputName = await form.$("input[name='item']");
    const inputPrice = await form.$("input[name='price']");

    await inputName.type("");
    await inputPrice.type("100");

    await buttonSubmit.click();

    const nameTooltip = await page.evaluate(() => {
      return (
        document.querySelector(".form-error")?.textContent ===
        "Нам потребуется название..."
      );
    });

    await expect(nameTooltip).toBe(true);
  });

  test.each([
    ["когда поле пустое", "", "Нам потребуется стоимость..."],
    [
      "когда введены не цифры",
      "1абв2гд",
      "Цена должна быть положительным числом",
    ],
    ["когда цена 0", "0", "Цена должна быть положительным числом"],
    ["когда цена меньше нуля", "-1", "Цена должна быть положительным числом"],
  ])("Появление тултипа цен товара s%", async (_, phrase, expected) => {
    await page.goto(baseUrl);

    const mainContainer = await page.$(".main_container");
    const button = await mainContainer.$(".button_add");

    await button.click();

    const form = await page.$(".form");
    const buttonSubmit = await form.$(".submit-btn");
    const inputName = await form.$("input[name='item']");
    const inputPrice = await form.$("input[name='price']");

    await inputName.type("айфон");
    await inputPrice.type(phrase);

    await buttonSubmit.click();

    const nameTooltip = await page.evaluate(() => {
      return document.querySelector(".form-error")?.textContent;
    });

    await expect(nameTooltip).toBe(expected);
  });
});
