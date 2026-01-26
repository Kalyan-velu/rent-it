import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Authentication Flow', () => {
  test('should allow user to login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Should show user info
    await expect(page.getByText('admin@example.com')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('login page should have no accessibility violations', async ({ page }) => {
    await page.goto('/login');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Customer Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should display customer list', async ({ page }) => {
    await page.goto('/customers');
    
    // Should show customers table
    await expect(page.getByRole('table')).toBeVisible();
    
    // Should have search input
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test('should create new customer', async ({ page }) => {
    await page.goto('/customers');
    
    await page.click('text=Add Customer');
    
    // Fill in form
    await page.fill('[name="name"]', 'John Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="phone"]', '+1234567890');
    
    await page.click('button:has-text("Create")');
    
    // Should show success message
    await expect(page.getByText(/customer created/i)).toBeVisible();
  });

  test('customers page should have no accessibility violations', async ({ page }) => {
    await page.goto('/customers');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
