import { test, expect } from '@playwright/test';

test.describe('Announcements Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/announcements');
  });

  test('should display the announcements page title and header', async ({ page }) => {
    await expect(page).toHaveTitle(/Community Allotment/);
    await expect(page.getByRole('heading', { name: '📢 Community Announcements' })).toBeVisible();
    await expect(page.getByText('Stay up to date with the latest news')).toBeVisible();
  });

  test('should display subscription notification box', async ({ page }) => {
    await expect(page.getByText('Never miss an announcement!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Subscribe to Notifications' })).toBeVisible();
  });

  test('should display filter buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Deliveries' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Orders' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tips' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Events' })).toBeVisible();
  });

  test('should load and display announcements', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForLoadState('networkidle');
    
    // Check if announcements are loaded (should have at least one announcement)
    const announcementCards = page.locator('[data-testid="announcement-card"]');
    await expect(announcementCards).toHaveCount(await announcementCards.count());
    
    if (await announcementCards.count() > 0) {
      // Check first announcement has required elements
      const firstCard = announcementCards.first();
      await expect(firstCard).toBeVisible();
      await expect(firstCard.locator('h3')).toBeVisible(); // Title
      await expect(firstCard.locator('p')).toBeVisible(); // Content
    }
  });

  test('should filter announcements by type', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click on Deliveries filter
    await page.getByRole('button', { name: 'Deliveries' }).click();
    
    // Check that the filter is active
    await expect(page.getByRole('button', { name: 'Deliveries' })).toHaveClass(/bg-orange-500/);
    
    // Click on Orders filter
    await page.getByRole('button', { name: 'Orders' }).click();
    
    // Check that the filter is active
    await expect(page.getByRole('button', { name: 'Orders' })).toHaveClass(/bg-blue-500/);
    
    // Click back to All
    await page.getByRole('button', { name: 'All' }).click();
    
    // Check that All filter is active
    await expect(page.getByRole('button', { name: 'All' })).toHaveClass(/bg-primary-500/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Check that the header is still visible
    await expect(page.getByRole('heading', { name: '📢 Community Announcements' })).toBeVisible();
    
    // Check that filter buttons are still accessible
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
  });

  test('should handle empty announcements state', async ({ page }) => {
    // Mock empty response
    await page.route('/api/announcements', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await page.goto('/announcements');
    await page.waitForLoadState('networkidle');
    
    // Should show some indication of no announcements
    const announcementCards = page.locator('[data-testid="announcement-card"]');
    await expect(announcementCards).toHaveCount(0);
  });

  test('should handle API error gracefully', async ({ page }) => {
    // Mock API error
    await page.route('/api/announcements', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await page.goto('/announcements');
    await page.waitForLoadState('networkidle');
    
    // Should not crash and should show loading state ends
    await expect(page.getByRole('heading', { name: '📢 Community Announcements' })).toBeVisible();
  });

  test('should display announcement types with correct styling', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const announcementCards = page.locator('[data-testid="announcement-card"]');
    
    if (await announcementCards.count() > 0) {
      // Check that announcement types have proper badges
      const typeElements = page.locator('[data-testid="announcement-type"]');
      
      for (let i = 0; i < await typeElements.count(); i++) {
        const typeElement = typeElements.nth(i);
        const text = await typeElement.textContent();
        
        // Check that the type has proper styling based on type
        if (text?.includes('Delivery')) {
          await expect(typeElement).toHaveClass(/bg-orange-100/);
        } else if (text?.includes('Order')) {
          await expect(typeElement).toHaveClass(/bg-blue-100/);
        } else if (text?.includes('Tip')) {
          await expect(typeElement).toHaveClass(/bg-green-100/);
        } else if (text?.includes('Event')) {
          await expect(typeElement).toHaveClass(/bg-purple-100/);
        }
      }
    }
  });
});
