import GoogleDoc, { SCOLL_CONTAINER_CLASS } from "./index";

test("foundScrollContainer should be false if there is no div with SCOLL_CONTAINER_CLASS", () => {
  document.body.innerHTML = `<span></span><p></p>`;
  const googleDoc = new GoogleDoc();
  expect(googleDoc.foundScrollContainer()).toStrictEqual(false);
});

test("foundScrollContainer should be true if there is a div with the SCOLL_CONTAINER_CLASS", () => {
  document.body.innerHTML = `<div class="${SCOLL_CONTAINER_CLASS}"></div>`;
  const googleDoc = new GoogleDoc();
  expect(googleDoc.foundScrollContainer()).toStrictEqual(true);
});
