import React from "react";
import { Cart } from "../../src/client/pages/Cart";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { render, screen, within } from "@testing-library/react";
import { CartApiMock, ExampleApiMock } from "./catalog.test";
import { initStore } from "../../src/client/store";
import { CartApi } from "../../src/client/api";
import { Application } from "../../src/client/Application";


describe('Корзина:', () => {
  it('в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', () => {
    const basename = '/hw/store/catalog';

    const api = new ExampleApiMock(basename);
    const cart = new CartApiMock();
    const store = initStore(api, cart);

    const { getByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.getByRole('link', {
      name: /cart \(2\)/i
    })).toBeDefined();
  }),

  it('в корзине должна отображаться таблица с добавленными в нее товарами', () => {
    const basename = '/hw/store/catalog';

    const api = new ExampleApiMock(basename);
    const cart = new CartApiMock();
    const store = initStore(api, cart);

    const { getByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    expect(getByTestId(1)).toBeDefined();
    expect(getByTestId(10)).toBeDefined();
  }),

  it('для каждого товара должны отображаться название, цена, количество , стоимость,' +
   'а также должна отображаться общая сумма заказа', () => {
    const basename = '/hw/store/catalog';

    const api = new ExampleApiMock(basename);
    const cart = new CartApiMock();
    const store = initStore(api, cart);

    const { getByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    expect(getByTestId("1-name").textContent).toBe("Tasty Keyboard");
    expect(getByTestId("1-price").textContent).toBe("$407");
    expect(getByTestId("1-count").textContent).toBe("3");
    expect(getByTestId("1-total").textContent).toBe("$1221");

    expect(getByTestId("10-name").textContent).toBe("Test Name");
    expect(getByTestId("10-price").textContent).toBe("$999");
    expect(getByTestId("10-count").textContent).toBe("5");
    expect(getByTestId("10-total").textContent).toBe("$4995");

    expect(getByTestId("table-total").textContent).toBe("$6216");
  }),

  it('если корзина пустая, должна отображаться ссылка на каталог товаров', () => {
    const basename = '/hw/store/catalog';

    const api = new ExampleApiMock(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);

    const { getByRole } = render(
      <BrowserRouter>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    const link = getByRole("link") as HTMLAnchorElement;
    expect(link.href).toBe("http://localhost/catalog");
  })
});
