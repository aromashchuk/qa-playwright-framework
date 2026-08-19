import { test } from '../../src/fixtures/test-options.js';

test.describe('Checkout', () => {
  test('a single item can be purchased end to end', async ({ loggedIn: inventory, cartPage, checkoutPage }) => {
    await inventory.addItemToCart('sauce-labs-backpack');
    await inventory.expectCartCount(1);
    await inventory.openCart();
    await cartPage.expectItemCount(1);
    await cartPage.expectItemPresent('Sauce Labs Backpack');
    await cartPage.checkout();
    await checkoutPage.fillCustomerDetails();
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });

  test('two items can be purchased end to end', async ({ loggedIn: inventory, cartPage, checkoutPage }) => {
    await inventory.addItemToCart('sauce-labs-backpack');
    await inventory.addItemToCart('sauce-labs-bike-light');
    await inventory.expectCartCount(2);
    await inventory.openCart();
    await cartPage.expectItemCount(2);
    await cartPage.checkout();
    await checkoutPage.fillCustomerDetails();
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });

  test('checkout requires a first name', async ({ loggedIn: inventory, cartPage, checkoutPage }) => {
    await inventory.addItemToCart('sauce-labs-backpack');
    await inventory.openCart();
    await cartPage.checkout();
    await checkoutPage.continueWithoutDetails();
    await checkoutPage.expectError(/First Name is required/i);
  });
});
