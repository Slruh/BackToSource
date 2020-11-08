import ExtensionEventController from "./index";
import Footer, { Identifier } from "../ui";
import GoogleDoc from "../googleDoc";
import ScrollTopStack from "../scrollTopStack";
import { mocked } from "ts-jest/utils";

jest.mock("../googleDoc");
jest.mock("../ui");

describe("ExtensionEventController handles clicks", () => {
  let scrollTopStack = new ScrollTopStack();
  const MockedGoogleDoc = mocked(GoogleDoc, true);
  const MockedFooter = mocked(Footer, true);

  beforeEach(() => {
    scrollTopStack = new ScrollTopStack();
    MockedGoogleDoc.mockClear();
    MockedFooter.mockClear();
  });

  test("Clicks without a target exit early", () => {
    const footer = new Footer(scrollTopStack);
    const eventController = new ExtensionEventController(
      scrollTopStack,
      footer
    );

    eventController.handleClick(null);

    expect(MockedGoogleDoc).toHaveBeenCalled();
    const instance = MockedGoogleDoc.mock.instances[0];

    expect(instance.currentScrollTop).not.toHaveBeenCalled();
  });

  test("Link clicks (not on the footer) will get the current scroll top from GoogleDoc", () => {
    const eventController = new ExtensionEventController(
      scrollTopStack,
      new Footer(scrollTopStack)
    );

    const instance = MockedGoogleDoc.mock.instances[0];
    jest.spyOn(instance, "foundScrollContainer").mockImplementation(() => true);
    jest.spyOn(instance, "currentScrollTop").mockImplementation(() => 42);
    const setterspy = jest.spyOn(eventController, "lastLinkScrollTop", "set");
    const eventTarget = document.createElement("a");
    eventController.handleClick(eventTarget);

    expect(MockedGoogleDoc).toHaveBeenCalled();
    expect(instance.foundScrollContainer).toHaveBeenCalled();
    expect(instance.currentScrollTop).toHaveBeenCalled();
    expect(setterspy).toHaveBeenCalled();
    expect(eventController.lastLinkScrollTop).toStrictEqual(42);
  });

  test("Clicks on the footer, with an empty stack, will hide the footer", () => {
    const eventController = new ExtensionEventController(
      scrollTopStack,
      new Footer(scrollTopStack)
    );

    const googleDocInstance = MockedGoogleDoc.mock.instances[0];
    jest
      .spyOn(googleDocInstance, "foundScrollContainer")
      .mockImplementation(() => true);

    const footerInstance = MockedFooter.mock.instances[0];
    jest.spyOn(footerInstance, "hide");

    const eventTarget = document.createElement("a");
    eventTarget.id = Identifier.Link;
    eventController.handleClick(eventTarget);

    expect(googleDocInstance.foundScrollContainer).toHaveBeenCalled();
    expect(googleDocInstance.currentScrollTop).not.toHaveBeenCalled();
    expect(MockedFooter).toHaveBeenCalled();
    expect(footerInstance.hide).toHaveBeenCalled();
  });

  test("Click on the footer, with a one element stack, will pop it and then hide the footer", () => {
    const singleStackValue = 42;
    scrollTopStack.push(singleStackValue);
    const eventController = new ExtensionEventController(
      scrollTopStack,
      new Footer(scrollTopStack)
    );

    const googleDocInstance = MockedGoogleDoc.mock.instances[0];
    jest
      .spyOn(googleDocInstance, "foundScrollContainer")
      .mockImplementation(() => true);

    const footerInstance = MockedFooter.mock.instances[0];
    jest.spyOn(footerInstance, "hide");

    jest.spyOn(scrollTopStack, "pop");

    const eventTarget = document.createElement("a");
    eventTarget.id = Identifier.Link;
    eventController.handleClick(eventTarget);

    expect(googleDocInstance.foundScrollContainer).toHaveBeenCalled();
    expect(googleDocInstance.currentScrollTop).not.toHaveBeenCalled();
    expect(MockedFooter).toHaveBeenCalled();
    expect(scrollTopStack.pop).toHaveBeenCalled();
    expect(footerInstance.hide).toHaveBeenCalled();
  });

  test("Click on the footer, with more than one element on the stack, will pop it but not hide the footer", () => {
    const stackValue = 42;
    scrollTopStack.push(stackValue);
    scrollTopStack.push(stackValue);
    const eventController = new ExtensionEventController(
      scrollTopStack,
      new Footer(scrollTopStack)
    );

    const googleDocInstance = MockedGoogleDoc.mock.instances[0];
    jest
      .spyOn(googleDocInstance, "foundScrollContainer")
      .mockImplementation(() => true);

    const footerInstance = MockedFooter.mock.instances[0];
    jest.spyOn(footerInstance, "hide");

    jest.spyOn(scrollTopStack, "pop");

    expect(scrollTopStack.size()).toStrictEqual(2);
    const eventTarget = document.createElement("a");
    eventTarget.id = Identifier.Link;
    eventController.handleClick(eventTarget);

    expect(googleDocInstance.foundScrollContainer).toHaveBeenCalled();
    expect(googleDocInstance.currentScrollTop).not.toHaveBeenCalled();
    expect(MockedFooter).toHaveBeenCalled();
    expect(scrollTopStack.pop).toHaveBeenCalled();
    expect(footerInstance.hide).not.toHaveBeenCalled();
    expect(scrollTopStack.size()).toStrictEqual(1);
  });
});

describe("ExtensionEventController handles hash changes correctly", () => {
  let scrollTopStack = new ScrollTopStack();
  const MockedGoogleDoc = mocked(GoogleDoc, true);
  const MockedFooter = mocked(Footer, true);

  beforeEach(() => {
    scrollTopStack = new ScrollTopStack();
    MockedGoogleDoc.mockClear();
    MockedFooter.mockClear();
  });

  test("If there is no scroll container hash changes have no effect", () => {
    const eventController = new ExtensionEventController(
      scrollTopStack,
      new Footer(scrollTopStack)
    );

    const googleDocInstance = MockedGoogleDoc.mock.instances[0];
    jest
      .spyOn(googleDocInstance, "foundScrollContainer")
      .mockImplementation(() => true);

    const footerInstance = MockedFooter.mock.instances[0];
    jest.spyOn(footerInstance, "show");
    jest.spyOn(scrollTopStack, "push");

    eventController.handleHashChange("");

    expect(googleDocInstance.foundScrollContainer).toHaveBeenCalled();
    expect(scrollTopStack.push).not.toHaveBeenCalled();
    expect(footerInstance.show).not.toHaveBeenCalled();
  });

  const urlCases = ["bookmark=id42", "heading=h42"];
  test.each(urlCases)(
    "If the hash changes and includes %s, then push the current scrollTop and show the footer",
    (url) => {
      const eventController = new ExtensionEventController(
        scrollTopStack,
        new Footer(scrollTopStack)
      );

      const googleDocInstance = MockedGoogleDoc.mock.instances[0];
      jest
        .spyOn(googleDocInstance, "foundScrollContainer")
        .mockImplementation(() => true);

      const footerInstance = MockedFooter.mock.instances[0];
      jest.spyOn(footerInstance, "show");
      jest.spyOn(scrollTopStack, "push");

      const getterspy = jest
        .spyOn(eventController, "lastLinkScrollTop", "get")
        .mockImplementation(() => 42);

      eventController.handleHashChange(url);

      expect(getterspy).toHaveBeenCalled();
      expect(scrollTopStack.push).toHaveBeenCalled();
      expect(scrollTopStack.peek()).toStrictEqual(42);
      expect(footerInstance.show).toHaveBeenCalled();
    }
  );
});
