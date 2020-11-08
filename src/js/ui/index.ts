import { highestZIndex } from "../highestZIndex";
import ScrollTopStack from "../scrollTopStack";

export enum Identifier {
  Link = "BackToSourceLink",
  Container = "BackToSourceContainer",
}

export default class Footer {
  private container: HTMLDivElement;
  private scrollTopStack: ScrollTopStack;
  private zIndex: number;

  constructor(scrollTopStack: ScrollTopStack) {
    this.scrollTopStack = scrollTopStack;
    this.zIndex = highestZIndex("div") + 1;
  }

  private generateLink(): HTMLAnchorElement {
    const link = document.createElement("a");
    link.id = Identifier.Link;
    link.style.cssText = `
      cursor:pointer;
      display:inline-block;
      width:100%;
    `;
    link.innerText = `Back to bookmark (${this.scrollTopStack.size()})`;
    return link;
  }

  show(): void {
    this.container = document.createElement("div");
    this.container.id = Identifier.Container;
    this.container.style.cssText = `
      background: #1DA1F2;
      border-top: 1px solid grey;
      bottom: 0; 
      color:white; 
      padding: 10px; 
      position:fixed; 
      text-align: center; 
      width: 100%;
      z-index: ${this.zIndex}
    `;

    this.container.appendChild(this.generateLink());

    document.body.appendChild(this.container);
  }

  hide(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}
