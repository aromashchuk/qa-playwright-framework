import { test } from '../../src/fixtures/test-options.js';
import { users } from '../../src/data/users.js';

const invalidLogins = [
  { name: 'wrong password', username: 'standard_user', password: 'wrong', error: /do not match/i },
  { name: 'missing username', username: '', password: 'secret_sauce', error: /Username is required/i },
  { name: 'missing password', username: 'standard_user', password: '', error: /Password is required/i },
];

test.describe('Login', () => {
  test('standard user reaches the inventory page', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('locked-out user is rejected with an error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await loginPage.expectLoginError(/locked out/i);
  });

  for (const c of invalidLogins) {
    test(`rejects login: ${c.name}`, async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(c.username, c.password);
      await loginPage.expectLoginError(c.error);
    });
  }
});
