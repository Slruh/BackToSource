export const SCOLL_CONTAINER_CLASS = "kix-appview-editor";

export default class GoogleDoc {
  private scrollContainerElement: HTMLElement;

  constructor() {
    const scrollContainers = document.getElementsByClassName(
      SCOLL_CONTAINER_CLASS
    );

    // Filter out any non HTMLElements
    const htmlElements: Array<HTMLElement> = Array.from(
      scrollContainers
    ).reduce((htmlElements, element) => {
      if (element instanceof HTMLElement) {
        return [...htmlElements, element];
      }

      return htmlElements;
    }, []);

    if (htmlElements.length > 0) {
      const scrollingElement = htmlElements[0];
      this.scrollContainerElement = scrollingElement;
      scrollingElement.style.scrollBehavior = "smooth";
    }

    this.foundScrollContainer = this.foundScrollContainer.bind(this);
    this.currentScrollTop = this.currentScrollTop.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
  }

  foundScrollContainer(): boolean {
    return !!this.scrollContainerElement;
  }

  currentScrollTop(): number {
    if (this.foundScrollContainer()) {
      return this.scrollContainerElement.scrollTop;
    }

    return null;
  }

  scrollTo(yPosition: number): void {
    this.scrollContainerElement.scrollTo(0, yPosition);
  }
}
