import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

// Demo data to reset to before each test
const DEMO_DATA = [
  {
    "id": "demo-1",
    "type": "delivery",
    "title": "Bark Mulch Delivery - This Saturday",
    "content": "Fresh bark mulch will be delivered this Saturday at 9 AM. Please ensure your plot area is accessible for the delivery truck.",
    "author": "Admin",
    "date": "2025-06-16",
    "priority": "high",
    "isActive": true,
    "createdAt": "2025-06-19T12:00:00.000Z",
    "updatedAt": "2025-06-19T12:00:00.000Z"
  },
  {
    "id": "demo-2",
    "type": "order",
    "title": "Summer Seed Order Deadline",
    "content": "Last chance to submit your orders for summer vegetable seeds. Order deadline is June 20th.",
    "author": "Plot Manager",
    "date": "2025-06-15",
    "priority": "medium",
    "isActive": true,
    "createdAt": "2025-06-19T11:00:00.000Z",
    "updatedAt": "2025-06-19T11:00:00.000Z"
  },
  {
    "id": "demo-3",
    "type": "tip",
    "title": "Watering Tips for Hot Weather",
    "content": "During hot weather, water your plants early in the morning or late in the evening to reduce evaporation and prevent leaf burn.",
    "author": "Garden Expert",
    "date": "2025-06-18",
    "priority": "low",
    "isActive": true,
    "createdAt": "2025-06-18T10:00:00.000Z",
    "updatedAt": "2025-06-18T10:00:00.000Z"
  },
  {
    "id": "demo-4",
    "type": "event",
    "title": "Water Conservation Workshop",
    "content": "Join us for a workshop on water conservation techniques for your allotment. Saturday 10 AM at the community shed.",
    "author": "Admin",
    "date": "2025-06-18",
    "priority": "medium",
    "isActive": false,
    "createdAt": "2025-06-17T15:00:00.000Z",
    "updatedAt": "2025-06-17T15:00:00.000Z"
  }
];

const DATA_FILE = path.join(process.cwd(), 'data', 'announcements.json');

async function resetDataFile() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEMO_DATA, null, 2));
  } catch (error) {
    console.error('Failed to reset data file:', error);
  }
}

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Reset data file before each test
    await resetDataFile();
    
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    // Reset data file after each test for cleanup
    await resetDataFile();
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
    
    // Check for stats values using test IDs to avoid ambiguity
    await expect(page.getByTestId('stat-total-users-value')).toHaveText('156');
    await expect(page.getByTestId('stat-active-subscriptions-value')).toHaveText('124');
    await expect(page.getByTestId('stat-announcements-this-month-value')).toHaveText('12');
    await expect(page.getByTestId('stat-avg.-engagement-rate-value')).toHaveText('78%');
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
    // Wait for the announcements to load
    await page.waitForSelector('tbody tr', { timeout: 10000 });
    
    // Check for sample announcements from the demo data
    await expect(page.getByText('Bark Mulch Delivery - This Saturday')).toBeVisible();
    await expect(page.getByText('Summer Seed Order Deadline')).toBeVisible();
    await expect(page.getByText('Water Conservation Workshop')).toBeVisible();
  });

  test('should display type badges with correct styling', async ({ page }) => {
    // Wait for the announcements to load
    await page.waitForSelector('tbody tr', { timeout: 10000 });
    
    // Check delivery type badge (use first occurrence)
    const deliveryBadge = page.getByTestId('type-badge-delivery').first();
    await expect(deliveryBadge).toHaveClass(/bg-orange-100/);
    
    // Check order type badge
    const orderBadge = page.getByTestId('type-badge-order').first();
    await expect(orderBadge).toHaveClass(/bg-blue-100/);
    
    // Check tip type badge
    const tipBadge = page.getByTestId('type-badge-tip').first();
    await expect(tipBadge).toHaveClass(/bg-green-100/);
    
    // Check event type badge
    const eventBadge = page.getByTestId('type-badge-event').first();
    await expect(eventBadge).toHaveClass(/bg-purple-100/);
  });

  test('should display status badges with correct styling', async ({ page }) => {
    // Wait for the announcements to load
    await page.waitForSelector('tbody tr', { timeout: 10000 });
    
    // Check published status badges
    const publishedBadges = page.locator('text=published');
    await expect(publishedBadges.first()).toHaveClass(/bg-green-100/);
    
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
    // Wait for the announcements to load
    await page.waitForSelector('tbody tr', { timeout: 10000 });
    
    // Check that view icons are displayed
    const eyeIcons = page.locator('[data-lucide="eye"]');
    await expect(eyeIcons.first()).toBeVisible();
    
    // Check for engagement display (our demo data doesn't have views/reactions, so should show 0)
    await expect(page.locator('text=👍 0').first()).toBeVisible();
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
