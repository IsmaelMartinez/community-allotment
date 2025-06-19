import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
  });

  test('should display the admin dashboard with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Community Allotment/);
    await expect(page.getByRole('heading', { name: '🔧 Admin Dashboard' })).toBeVisible();
    await expect(page.getByText('Manage your allotment community platform')).toBeVisible();
  });

  test('should display stats cards', async ({ page }) => {
    // Check for stats cards
    await expect(page.getByText('Total Users')).toBeVisible();
    await expect(page.getByText('Active Subscriptions')).toBeVisible();
    await expect(page.getByText('Announcements This Month')).toBeVisible();
    await expect(page.getByText('Avg. Engagement Rate')).toBeVisible();
    
    // Check for stats values
    await expect(page.getByText('156')).toBeVisible();
    await expect(page.getByText('124')).toBeVisible();
    await expect(page.getByText('12')).toBeVisible();
    await expect(page.getByText('78%')).toBeVisible();
  });

  test('should display navigation tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Announcements' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
  });

  test('should show announcements tab by default', async ({ page }) => {
    // Check that announcements tab is active
    const announcementsTab = page.getByRole('button', { name: 'Announcements' });
    await expect(announcementsTab).toHaveClass(/border-primary-500/);
    
    // Check that announcements content is visible
    await expect(page.getByRole('heading', { name: 'Manage Announcements' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Announcement' })).toBeVisible();
  });

  test('should display announcements table with headers', async ({ page }) => {
    // Check table headers
    await expect(page.getByRole('columnheader', { name: 'Title' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Type' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Author' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Date' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Engagement' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  });

  test('should display sample announcements in table', async ({ page }) => {
    // Check for sample announcements
    await expect(page.getByText('Bark Mulch Delivery - This Saturday')).toBeVisible();
    await expect(page.getByText('Summer Seed Order Deadline')).toBeVisible();
    await expect(page.getByText('Water Conservation Workshop')).toBeVisible();
  });

  test('should display type badges with correct styling', async ({ page }) => {
    // Check delivery type badge
    const deliveryBadge = page.locator('text=delivery').first();
    await expect(deliveryBadge).toHaveClass(/bg-orange-100/);
    
    // Check order type badge
    const orderBadge = page.locator('text=order').first();
    await expect(orderBadge).toHaveClass(/bg-blue-100/);
    
    // Check event type badge
    const eventBadge = page.locator('text=event').first();
    await expect(eventBadge).toHaveClass(/bg-purple-100/);
  });

  test('should display status badges with correct styling', async ({ page }) => {
    // Check published status badges
    const publishedBadges = page.locator('text=published');
    for (let i = 0; i < await publishedBadges.count(); i++) {
      await expect(publishedBadges.nth(i)).toHaveClass(/bg-green-100/);
    }
    
    // Check draft status badge
    const draftBadge = page.locator('text=draft').first();
    await expect(draftBadge).toHaveClass(/bg-yellow-100/);
  });

  test('should display action buttons for each announcement', async ({ page }) => {
    // Get all table rows (excluding header)
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const row = tableRows.nth(i);
      
      // Check for edit button (pencil icon)
      await expect(row.locator('[data-testid="edit-button"]')).toBeVisible();
      
      // Check for delete button (trash icon)
      await expect(row.locator('[data-testid="delete-button"]')).toBeVisible();
    }
  });

  test('should switch between tabs', async ({ page }) => {
    // Click on Users tab
    await page.getByRole('button', { name: 'Users' }).click();
    
    // Check that Users tab is now active
    const usersTab = page.getByRole('button', { name: 'Users' });
    await expect(usersTab).toHaveClass(/border-primary-500/);
    
    // Check that users content is visible
    await expect(page.getByRole('heading', { name: 'Manage Users' })).toBeVisible();
    
    // Click on Settings tab
    await page.getByRole('button', { name: 'Settings' }).click();
    
    // Check that Settings tab is now active
    const settingsTab = page.getByRole('button', { name: 'Settings' });
    await expect(settingsTab).toHaveClass(/border-primary-500/);
    
    // Check that settings content is visible
    await expect(page.getByRole('heading', { name: 'Platform Settings' })).toBeVisible();
    
    // Go back to Announcements tab
    await page.getByRole('button', { name: 'Announcements' }).click();
    
    // Check that we're back to announcements
    await expect(page.getByRole('heading', { name: 'Manage Announcements' })).toBeVisible();
  });

  test('should display engagement metrics', async ({ page }) => {
    // Check that view counts are displayed
    const eyeIcons = page.locator('[data-lucide="eye"]');
    await expect(eyeIcons.first()).toBeVisible();
    
    // Check for specific engagement numbers
    await expect(page.getByText('45')).toBeVisible(); // Views for first announcement
    await expect(page.getByText('32')).toBeVisible(); // Views for second announcement
    
    // Check for reaction counts
    await expect(page.getByText('👍 12')).toBeVisible();
    await expect(page.getByText('👍 8')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that the header is still visible
    await expect(page.getByRole('heading', { name: '🔧 Admin Dashboard' })).toBeVisible();
    
    // Check that stats are still accessible (might be stacked)
    await expect(page.getByText('Total Users')).toBeVisible();
    
    // Check that navigation tabs are still usable
    await expect(page.getByRole('button', { name: 'Announcements' })).toBeVisible();
  });

  test('should display users management section', async ({ page }) => {
    // Switch to Users tab
    await page.getByRole('button', { name: 'Users' }).click();
    
    // Check users table headers
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Joined' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    
    // Check for sample users
    await expect(page.getByText('John Smith')).toBeVisible();
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    await expect(page.getByText('Mike Wilson')).toBeVisible();
  });

  test('should display settings section', async ({ page }) => {
    // Switch to Settings tab
    await page.getByRole('button', { name: 'Settings' }).click();
    
    // Check settings sections
    await expect(page.getByText('Notification Settings')).toBeVisible();
    await expect(page.getByText('Content Moderation')).toBeVisible();
    await expect(page.getByText('System Configuration')).toBeVisible();
    
    // Check for toggle switches
    await expect(page.locator('input[type="checkbox"]').first()).toBeVisible();
  });

  test('should handle New Announcement button click', async ({ page }) => {
    const newAnnouncementButton = page.getByRole('button', { name: 'New Announcement' });
    await expect(newAnnouncementButton).toBeVisible();
    
    // The button should be clickable (we're not testing the modal/form here, just that it exists)
    await expect(newAnnouncementButton).toBeEnabled();
  });
});
