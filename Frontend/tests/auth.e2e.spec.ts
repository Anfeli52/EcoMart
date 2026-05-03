import { expect, test } from '@playwright/test';

test.describe('Auth E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/user/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Inicio de sesión exitoso',
          token: 'e2e-login-token',
          user: {
            id: 1,
            nombre: 'Juan',
            correo: 'juan@mail.com',
            role: 'user',
            direccion_envio: 'Calle 123'
          }
        })
      });
    });

    await page.route('**/user/register', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Registro exitoso'
        })
      });
    });
  });

  test('login exitoso guarda token', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Correo').fill('juan@mail.com');
    await page.getByPlaceholder('Contraseña').fill('password123');

    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('token'))).toBe(
      'e2e-login-token'
    );
  });

  test('register exitoso navega a login', async ({ page }) => {
    await page.goto('/register');

    await page.getByPlaceholder('Nombre').fill('Juan');
    await page.getByPlaceholder('Correo').fill('juan@mail.com');
    await page.getByPlaceholder('Contraseña').fill('password123');
    await page.getByPlaceholder('Dirección de Envío').fill('Calle 123');
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Registro exitoso');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Registrarse' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('h2')).toHaveText('Iniciar Sesión');
  });

  test('register muestra error cuando la API falla', async ({ page }) => {
    await page.route('**/user/register', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'El correo ya esta registrado'
        })
      });
    });

    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('El correo ya esta registrado');
      await dialog.accept();
    });

    await page.goto('/register');

    await page.getByPlaceholder('Nombre').fill('Ana');
    await page.getByPlaceholder('Correo').fill('ana@mail.com');
    await page.getByPlaceholder('Contraseña').fill('password123');
    await page.getByPlaceholder('Dirección de Envío').fill('Calle 456');
    await page.getByRole('button', { name: 'Registrarse' }).click();

    await expect(page).toHaveURL(/\/register$/);
  });
});