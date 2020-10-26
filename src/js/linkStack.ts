export interface Stackish<T> {
  isEmpty: () => boolean;
  size: () => number;
  push: (val: T) => void;
  pop: () => T | null;
}

export class ScrollTopStack<T = number> implements Stackish<T> {
  private stack: Array<T>;

  constructor() {
    this.stack = [];
  }

  isEmpty = (): boolean => {
    return this.stack.length === 0;
  };

  push = (val: T): void => {
    this.stack.push(val);
  };

  pop = (): T => {
    return this.stack.pop();
  };

  size = (): number => {
    return this.stack.length;
  };
}
