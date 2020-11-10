import { highestZIndex } from "../highestZIndex";
import ScrollTopStack from "../scrollTopStack";

export enum Identifier {
  Close = "BackToSourceClose",
  Container = "BackToSourceContainer",
  Link = "BackToSourceLink",
}

export default class Footer {
  #container: HTMLDivElement;
  #link: HTMLAnchorElement;
  #scrollTopStack: ScrollTopStack;
  #zIndex: number;

  constructor(scrollTopStack: ScrollTopStack) {
    this.#scrollTopStack = scrollTopStack;
    this.#zIndex = highestZIndex("div") + 1;

    this.generateLinkText = this.generateLinkText.bind(this);
    this.generateCloseButton = this.generateCloseButton.bind(this);
    this.generateLink = this.generateLink.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  private generateLinkText(): string {
    return `Back to bookmark (${this.#scrollTopStack.size()})`;
  }

  private generateLink(): HTMLAnchorElement {
    const link = document.createElement("a");
    link.id = Identifier.Link;
    link.style.cssText = `
      cursor: pointer;
      display: inline-block;
      flex: 1;
      text-align: center;
    `;
    link.innerText = this.generateLinkText();
    return link;
  }

  private generateCloseButton(): HTMLButtonElement {
    const link = document.createElement("button");
    link.id = Identifier.Close;
    link.innerText = "X";
    link.style.cssText = `
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      margin-right: 10px;
    `;
    return link;
  }

  show(): void {
    if (!this.#container) {
      this.#container = document.createElement("div");
      this.#container.id = Identifier.Container;
      this.#container.style.cssText = `
        align-items: center;
        background: #1DA1F2;
        border-top: 1px solid grey;
        bottom: 0; 
        color:white; 
        display: flex;
        padding: 10px 0; 
        position:fixed; 
        width: 100%;
        z-index: ${this.#zIndex}
      `;

      this.#link = this.generateLink();
      this.#container.appendChild(this.#link);
      this.#container.appendChild(this.generateCloseButton());

      document.body.appendChild(this.#container);
    } else {
      const linkText = this.generateLinkText();
      console.debug("Link text", linkText);
      this.#link.innerText = linkText;
    }
  }

  hide(): void {
    if (this.#container) {
      this.#container.remove();
      this.#container = null;
      this.#link = null;
    }
  }
}
