const { assert } = require('chai');

describe('Test', async function() {
    it('Тест, который пройдет', async function() {
        await this.browser.url('https://www.microsoft.com/ru-ru/');
        await this.browser.assertView('plain', 'body');

        const title = await this.browser.$('#uhfLogo').getText();
        assert.equal(title, 'Microsoft');
    });
});
