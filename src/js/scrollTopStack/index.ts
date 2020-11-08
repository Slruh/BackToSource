export default class ScrollTopStack<T = number> {
  #stack: Array<T>;

  constructor() {
    this.#stack = [];
  }

  isEmpty = (): boolean => {
    return this.#stack.length === 0;
  };

  push = (val: T): void => {
    this.#stack.push(val);
  };

  pop = (): T => {
    return this.#stack.pop();
  };

  peek = (): T => {
    const size = this.size();
    if (size > 0) {
      return this.#stack[size - 1];
    }

    return null;
  };

  size = (): number => {
    return this.#stack.length;
  };
}
