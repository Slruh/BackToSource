import ScrollTopStack from "./index";

test("Verify initial values of a new Stack", () => {
  const stack = new ScrollTopStack();
  expect(stack.size()).toStrictEqual(0);
  expect(stack.isEmpty()).toStrictEqual(true);
});

test("Popping an empty stack returns null", () => {
  const stack = new ScrollTopStack();
  const result = stack.pop();
  expect(result).toStrictEqual(undefined);
});

test("Pushing and popping works for one number", () => {
  const stack = new ScrollTopStack();
  stack.push(42);

  expect(stack.size()).toStrictEqual(1);
  expect(stack.isEmpty()).toStrictEqual(false);

  const result = stack.pop();
  expect(result).toStrictEqual(42);
  expect(stack.size()).toStrictEqual(0);
  expect(stack.isEmpty()).toStrictEqual(true);
});
