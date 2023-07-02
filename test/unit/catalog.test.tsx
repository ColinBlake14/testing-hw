import React from 'react';
import { initStore } from '../../src/client/store';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getByTestId, render, waitFor} from '@testing-library/react';
import { Catalog } from '../../src/client/pages/Catalog';
import { CartState, CheckoutFormData, CheckoutResponse, ProductShortInfo } from '../../src/common/types';
import { Product as ProductT } from '../../src/common/types';
import { ProductDetails } from '../../src/client/components/ProductDetails';
import { CartBadge } from '../../src/client/components/CartBadge';
import { CartApi } from '../../src/client/api';

export interface AxiosI<T> {
  data: T
}

export class ExampleApiMock {
  constructor(private readonly basename: string) {

  }

  async getProducts() {
    return await Promise.resolve<AxiosI<ProductShortInfo[]>>({ data: [{
      id: 10,
      name: "Test Name",
      price: 999,
    },
    {
      id: 11,
      name: "Test Name2",
      price: 1000,
    }]});
  }

  async getProductById(id: number) {
    return await Promise.resolve<AxiosI<ProductT>>({ data: {
      id: 10,
      name: "Test Name",
      price: 999,
      description: "so good item here",
      material: "best material",
      color: "blue"
    }});
  }

  async checkout(form: CheckoutFormData, cart: CartState) {
    return await Promise.resolve<AxiosI<CheckoutResponse>>({ data: {id: 10}});
  }
}

export class CartApiMock {
  getState(): CartState {
    return {
      1: {
        name: "Tasty Keyboard",
        count: 3,
        price: 407
      },
      10: {
        name: "Test Name",
        count: 5,
        price: 999
      },
    };
  }

  setState(cart: CartState) {
    //localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
  }
}

const testProduct: ProductT = {
  id: 10,
  name: "Test Name",
  price: 999,
  description: "so good item here",
  material: "best material",
  color: "blue"
}

describe('Каталог:', () => {
    it('в каталоге должны отображаться товары, список которых приходит с сервера', async () => {
      const basename = '/hw/store/catalog';

      const api = new ExampleApiMock(basename);
      const cart = new CartApi();
      const store = initStore(api, cart);

      const { getAllByTestId } = render(
        <BrowserRouter>
          <Provider store={store}>
            <Catalog />
          </Provider>
        </BrowserRouter>
      );

      await waitFor(() => expect(getAllByTestId(10)).toBeDefined());
    }),

    it('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
      const basename = '/hw/store/catalog';

      const api = new ExampleApiMock(basename);
      const cart = new CartApi();
      const store = initStore(api, cart);

      const { getAllByTestId } = render(
        <BrowserRouter>
          <Provider store={store}>
            <Catalog />
          </Provider>
        </BrowserRouter>
      );

      await waitFor(() => expect(getAllByTestId(10)).toBeDefined());

      const items = getAllByTestId(10);

      expect(getByTestId(items[0], "10-title").textContent).toContain("Test Name");
      expect(getByTestId(items[0], "10-price").textContent).toContain("$999");

      const itemLink: HTMLAnchorElement = getByTestId(items[0], "10-link");
      expect(itemLink.href).toBe("http://localhost/catalog/10");
    }),

    it('на странице с подробной информацией отображаются: название товара,' +
      'его описание, цена, цвет, материал и кнопка "добавить в корзину"', async () => {
      const basename = '/hw/store/catalog';

      const api = new ExampleApiMock(basename);

      const cart = new CartApiMock();
      const store = initStore(api, cart);

      const { getByTestId } = render(
        <BrowserRouter>
          <Provider store={store}>
            <ProductDetails product={testProduct} />
          </Provider>
        </BrowserRouter>
      );

      expect(getByTestId("10")).toBeDefined();
      expect(getByTestId("10-name").textContent).toBe("Test Name");
      expect(getByTestId("10-description").textContent).toBe("so good item here");
      expect(getByTestId("10-price").textContent).toBe("$999");
      expect(getByTestId("10-color").textContent).toBe("blue");
      expect(getByTestId("10-material").textContent).toBe("best material");
      expect(getByTestId("10-button").textContent).toBe("Add to Cart");
    }),

    it('если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async () => {
      const basename = '/hw/store/catalog';

      const api = new ExampleApiMock(basename);
      const cart = new CartApiMock();
      const store = initStore(api, cart);

      const { getByTestId } = render(
        <BrowserRouter>
          <Provider store={store}>
            <CartBadge id={1}/>
          </Provider>
        </BrowserRouter>
      );

      expect(getByTestId("1-badge")).toBeDefined();
      expect(getByTestId("1-badge").textContent).toBe("Item in cart");
    })
});
