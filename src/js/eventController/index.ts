import ScrollTopStack from "../scrollTopStack";
import GoogleDoc from "../googleDoc";
import Footer, { Identifier } from "../ui";

enum TriggerLink {
  Bookmark = "bookmark=id",
  Heading = "heading=h",
}

export default class ExtensionEventController {
  #scrollTopStack: ScrollTopStack;
  #googleDoc: GoogleDoc;
  #footer: Footer;

  #lastLinkClickScrollTop: number = null;

  constructor(scrollTopStack: ScrollTopStack, footer: Footer) {
    this.#scrollTopStack = scrollTopStack;
    this.#googleDoc = new GoogleDoc();
    this.#footer = footer;

    this.handleClick = this.handleClick.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);
  }

  /** Used for testing */
  get lastLinkScrollTop(): number {
    return this.#lastLinkClickScrollTop;
  }

  /** Used for testing */
  set lastLinkScrollTop(value: number) {
    this.#lastLinkClickScrollTop = value;
  }

  handleClick(target: EventTarget): void {
    console.debug("Click detected");

    if (!(target instanceof Element)) {
      console.debug("Target of click is not an Element");
      return;
    }

    const element = target as Element;

    // If the close button is clicked, then remove the footer
    if (element.id === Identifier.Close) {
      this.#footer.hide();
      this.#scrollTopStack.reset();
      return;
    }

    // Any click besides the link in the footer
    if (
      element.id !== Identifier.Link &&
      this.#googleDoc.foundScrollContainer()
    ) {
      console.debug("Tracking currentScrollTop before possible navigation");
      this.lastLinkScrollTop = this.#googleDoc.currentScrollTop();
      return;
    }

    // Otherwise a click on the footer will scroll to the location on the top of the stack
    console.debug(
      "Footer was clicked, popping and scrolling",
      element.id || "no ID",
      this.#googleDoc.foundScrollContainer()
    );
    if (!this.#scrollTopStack.isEmpty()) {
      const scrollTop = this.#scrollTopStack.pop();
      this.#googleDoc.scrollTo(scrollTop);

      // Hide the footer if the stack is now empty
      if (this.#scrollTopStack.isEmpty()) {
        this.#footer.hide();
      } else {
        this.#footer.show();
      }
    } else {
      console.debug(
        "Footer link was clicked with the stack being empty; this shouldn't happen"
      );
      this.#footer.hide();
    }
  }

  handleHashChange(newURL: string): void {
    console.debug("Hash change detected");

    if (!this.#googleDoc.foundScrollContainer()) {
      return;
    }

    if (
      newURL.includes(TriggerLink.Bookmark) ||
      newURL.includes(TriggerLink.Heading)
    ) {
      console.debug("Hash change was caused by a TriggerLink");

      console.debug(
        `Pushing ${this.lastLinkScrollTop} scrollTop onto the stack`
      );
      this.#scrollTopStack.push(this.lastLinkScrollTop);
      this.#footer.show();
    }
  }
}
