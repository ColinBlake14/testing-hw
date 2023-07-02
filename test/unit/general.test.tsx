import React from 'react';
import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import events from "@testing-library/user-event";
import {  getByTestId, render, within } from '@testing-library/react';

const hamburgerWidth = 575;

function resizeToHamburgerWidth() {
    (window as any).innerWidth = hamburgerWidth;
    (window as any).dispatchEvent(new Event('resize'));
}

describe('Общие требования:', () => {
    it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
        const basename = '/hw/store';

        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);

        const application = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const { container } = render(application);
        const header = getByTestId(container ,"header");
        const navItems: Array<HTMLAnchorElement> = within(header).getAllByTestId("nav-link");
        const navItemsHref = navItems.map(nav => nav.href);

        expect(navItemsHref).toContain("http://localhost/hw/store/catalog");
        expect(navItemsHref).toContain("http://localhost/hw/store/delivery");
        expect(navItemsHref).toContain("http://localhost/hw/store/contacts");
        expect(navItemsHref).toContain("http://localhost/hw/store/cart");
    }),

    it('название магазина в шапке должно быть ссылкой на главную страницу', () => {
        const basename = '/hw/store';

        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);

        const application = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const { container } = render(application);
        const header = getByTestId(container ,"header");
        const navItem: HTMLAnchorElement = within(header).getByTestId("header-name");

        expect(navItem.href).toBe("http://localhost/hw/store/");
    }),
    
    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async () => {
        resizeToHamburgerWidth();

        const basename = '/hw/store';

        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);

        const application = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const { container, getByTestId, getAllByTestId } = render(application);

        const toggler = getByTestId("toggler");

        const navBar = getByTestId("navBar");
        const classNames = navBar.className.split(" ");

        expect(classNames).toContain("collapse");

        await events.click(toggler);

        const classNames2 = navBar.className.split(" ");

        expect(classNames2).not.toContain("collapse");

        const navItems = getAllByTestId("nav-link");

        await events.click(navItems[0]);

        const classNames3 = navBar.className.split(" ");

        expect(classNames3).toContain("collapse");
    })
});
