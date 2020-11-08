import ExtensionEventController from "./eventController";
import ScrollTopStack from "./scrollTopStack";
import Footer from "./ui";

const scrollTopStack = new ScrollTopStack();
const footer = new Footer(scrollTopStack);
const eventController = new ExtensionEventController(scrollTopStack, footer);

document.addEventListener("click", (event: MouseEvent) => {
  eventController.handleClick(event.target);
});
window.addEventListener("hashchange", (event: HashChangeEvent) => {
  eventController.handleHashChange(event.newURL);
});
