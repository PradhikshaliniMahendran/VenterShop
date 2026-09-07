import { test, expect } from '@playwright/test';

test.describe('VenterShop E2E Automated Suite', () => {

  test('1. Verify Virtual Shops section on Homepage', async ({ page }) => {
    await page.goto('https://ventershop.vercel.app');

    // Verify Virtual Shops Heading
    const heading = page.locator('text=Explore More Shops on VENTERSHOP');
    await expect(heading).toBeVisible();

    // Verify 8 Virtual Shop Cards exist
    const supermarketCard = page.locator('text=Virtual Supermarket');
    const shoeCard = page.locator('text=Virtual Shoe Shop');
    const bookCard = page.locator('text=Virtual Book Shop');
    const computerCard = page.locator('text=Virtual Computer Center');

    await expect(supermarketCard).toBeVisible();
    await expect(shoeCard).toBeVisible();
    await expect(bookCard).toBeVisible();
    await expect(computerCard).toBeVisible();
  });

  test('2. Click Virtual Supermarket and verify Shop page header banner', async ({ page }) => {
    await page.goto('https://ventershop.vercel.app');

    // Click Virtual Supermarket
    await page.click('text=Virtual Supermarket');

    // Verify URL
    await expect(page).toHaveURL(/.*category=groceries/);

    // Verify Selected Virtual Shop Banner Header
    const banner = page.locator('text=SELECTED VIRTUAL SHOP');
    await expect(banner).toBeVisible();
  });

  test('3. Click Offers in Navbar and verify single active link & Special Offers banner', async ({ page }) => {
    await page.goto('https://ventershop.vercel.app');

    // Click Offers in Header Nav
    await page.click('nav >> text=Offers');

    // Verify URL has offers=true
    await expect(page).toHaveURL(/.*offers=true/);

    // Verify Special Offers Banner on Shop Page
    const offersBanner = page.locator('text=SPECIAL OFFERS & PROMOTIONS');
    await expect(offersBanner).toBeVisible();
  });

});
