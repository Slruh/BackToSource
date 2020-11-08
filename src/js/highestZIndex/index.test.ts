import { highestZIndex, MIN_Z_INDEX } from "./index";

test("Default value is returned if no elements are found", () => {
  const zIndex = highestZIndex("div");
  expect(zIndex).toStrictEqual(MIN_Z_INDEX);
});

test("Default value is returned if there are no divs", () => {
  document.body.innerHTML = `<span></span><p></p>`;
  const zIndex = highestZIndex("div");
  expect(zIndex).toStrictEqual(MIN_Z_INDEX);
});

test("Correctly returns 1 as the z-index when there is one div with a z-index of 1", () => {
  document.body.innerHTML = `<div style="z-index:1"></div>`;
  const zIndex = highestZIndex("div");
  expect(zIndex).toStrictEqual(1);
});

test("Correctly returns the highest z-index when there are multiple divs", () => {
  document.body.innerHTML = `<div style="z-index:1"><div style="z-index:-1"></div></div><div style="z-index:5"></div>`;
  const zIndex = highestZIndex("div");
  expect(zIndex).toStrictEqual(5);
});
