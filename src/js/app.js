import { DomAndEvents } from "./DomAndEvents";

function app() {
  const domAndEvents = new DomAndEvents();
  domAndEvents.onClickCreateButton();
  domAndEvents.onClickUpdateButton();
  domAndEvents.onClickRemoveButton();
}

app();
