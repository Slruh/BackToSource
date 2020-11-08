export const MIN_Z_INDEX: number =
  Number.MIN_SAFE_INTEGER || -(Math.pow(2, 53) - 1);

export const highestZIndex = (elem: string): number => {
  const elements = document.getElementsByTagName(elem);
  return Array.from(elements).reduce(
    (highestZIndex: number, element: Element) => {
      const zIndex = Number.parseInt(
        document.defaultView
          .getComputedStyle(element, null)
          .getPropertyValue("z-index"),
        10
      );

      if (zIndex > highestZIndex) {
        return zIndex;
      }

      return highestZIndex;
    },
    MIN_Z_INDEX
  );
};
