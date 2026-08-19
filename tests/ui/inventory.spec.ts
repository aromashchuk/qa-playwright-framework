import { test, expect } from '../../src/fixtures/test-options.js';

test.describe('Inventory', () => {
  test('cart badge tracks items added and removed', async ({ loggedIn: inventory }) => {
    await inventory.addItemToCart('sauce-labs-backpack');
    await inventory.addItemToCart('sauce-labs-bike-light');
    await inventory.expectCartCount(2);
    await inventory.removeItemFromCart('sauce-labs-bike-light');
    await inventory.expectCartCount(1);
  });

  test('sorts products by price low to high', async ({ loggedIn: inventory }) => {
    await inventory.sortBy('lohi');
    const prices = await inventory.productPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts products by name Z to A', async ({ loggedIn: inventory }) => {
    await inventory.sortBy('za');
    const names = await inventory.productNames();
    expect(names).toEqual([...names].sort().reverse());
  });
});
