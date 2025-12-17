import { test, expect } from '@playwright/test'

test.describe('Grid Plotter', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/garden-planner')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should display grid planner view option', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Create a plan first
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden 2025')
    await page.getByRole('button', { name: /create/i }).click()
    
    // Check that Grid Planner view option is visible
    await expect(page.getByRole('button', { name: /grid planner/i })).toBeVisible()
  })

  test('should switch to grid view and show empty state', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Create a plan
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    
    // Switch to grid view
    await page.getByRole('button', { name: /grid planner/i }).click()
    
    // Should show empty state with create button
    await expect(page.getByText(/no grid plots yet/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /create grid plot/i })).toBeVisible()
  })

  test('should create a new grid plot with custom dimensions', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Create a plan
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    
    // Switch to grid view
    await page.getByRole('button', { name: /grid planner/i }).click()
    
    // Click create grid plot
    await page.getByRole('button', { name: /create grid plot/i }).click()
    
    // Fill in the form
    await page.getByLabel(/plot name/i).fill('North Bed')
    await page.getByLabel(/rows/i).fill('4')
    await page.getByLabel(/columns/i).fill('5')
    
    // Submit
    await page.getByRole('button', { name: /create plot/i }).click()
    
    // Verify the plot was created with the grid
    await expect(page.getByText('North Bed')).toBeVisible()
    await expect(page.getByText('4×5')).toBeVisible()
  })

  test('should display plant tray with available vegetables', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Create plan and switch to grid view
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    await page.getByRole('button', { name: /grid planner/i }).click()
    
    // Create a grid plot
    await page.getByRole('button', { name: /create grid plot/i }).click()
    await page.getByLabel(/plot name/i).fill('Test Plot')
    await page.getByRole('button', { name: /create plot/i }).click()
    
    // Check plant tray is visible with search
    await expect(page.getByPlaceholder(/search vegetables/i)).toBeVisible()
    
    // Check that some vegetables are listed
    await expect(page.getByText('Tomatoes')).toBeVisible()
    await expect(page.getByText('Carrots')).toBeVisible()
  })

  test('should filter plants by category', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Setup
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    await page.getByRole('button', { name: /grid planner/i }).click()
    await page.getByRole('button', { name: /create grid plot/i }).click()
    await page.getByLabel(/plot name/i).fill('Test Plot')
    await page.getByRole('button', { name: /create plot/i }).click()
    
    // Click on Legumes filter
    await page.getByRole('button', { name: /legumes/i }).click()
    
    // Should show legume vegetables
    await expect(page.getByText('Runner Beans')).toBeVisible()
    await expect(page.getByText('Peas')).toBeVisible()
    
    // Should not show non-legumes
    await expect(page.getByText('Tomatoes')).not.toBeVisible()
  })

  test('should search vegetables in plant tray', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Setup
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    await page.getByRole('button', { name: /grid planner/i }).click()
    await page.getByRole('button', { name: /create grid plot/i }).click()
    await page.getByLabel(/plot name/i).fill('Test Plot')
    await page.getByRole('button', { name: /create plot/i }).click()
    
    // Search for "tom"
    await page.getByPlaceholder(/search vegetables/i).fill('tom')
    
    // Should show tomatoes
    await expect(page.getByText('Tomatoes')).toBeVisible()
    
    // Should not show unrelated vegetables
    await expect(page.getByText('Carrots')).not.toBeVisible()
  })

  test('should display placement guide legend', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Setup
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    await page.getByRole('button', { name: /grid planner/i }).click()
    await page.getByRole('button', { name: /create grid plot/i }).click()
    await page.getByLabel(/plot name/i).fill('Test Plot')
    await page.getByRole('button', { name: /create plot/i }).click()
    
    // Check legend is visible
    await expect(page.getByText(/placement guide/i)).toBeVisible()
    await expect(page.getByText(/good companion/i)).toBeVisible()
    await expect(page.getByText(/neutral placement/i)).toBeVisible()
    await expect(page.getByText(/avoid placing/i)).toBeVisible()
  })

  test('should show add plot button after creating first plot', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Setup
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    await page.getByRole('button', { name: /grid planner/i }).click()
    await page.getByRole('button', { name: /create grid plot/i }).click()
    await page.getByLabel(/plot name/i).fill('Test Plot')
    await page.getByRole('button', { name: /create plot/i }).click()
    
    // Should show "Add Grid Plot" button at the bottom
    await expect(page.getByRole('button', { name: /add grid plot/i })).toBeVisible()
  })

  test('should display cell count in plot footer', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Setup with specific dimensions
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    await page.getByRole('button', { name: /grid planner/i }).click()
    await page.getByRole('button', { name: /create grid plot/i }).click()
    await page.getByLabel(/plot name/i).fill('Test Plot')
    await page.getByLabel(/rows/i).fill('3')
    await page.getByLabel(/columns/i).fill('4')
    await page.getByRole('button', { name: /create plot/i }).click()
    
    // Should show "0 / 12 cells planted" (3 rows × 4 cols = 12 cells)
    await expect(page.getByText(/0 \/ 12 cells planted/i)).toBeVisible()
  })
})

test.describe('Grid Plotter - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } }) // iPhone SE viewport

  test('should show mobile navigation controls', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Create plan and multiple plots
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    await page.getByRole('button', { name: /grid planner/i }).click()
    
    // Create first plot
    await page.getByRole('button', { name: /create grid plot/i }).click()
    await page.getByLabel(/plot name/i).fill('Plot A')
    await page.getByRole('button', { name: /create plot/i }).click()
    
    // Create second plot
    await page.getByRole('button', { name: /add grid plot/i }).click()
    await page.getByLabel(/plot name/i).fill('Plot B')
    await page.getByRole('button', { name: /create plot/i }).click()
    
    // Should show pagination "1 / 2"
    await expect(page.getByText('1 / 2')).toBeVisible()
  })

  test('should have collapsible plant tray on mobile', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Setup
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    await page.getByRole('button', { name: /grid planner/i }).click()
    await page.getByRole('button', { name: /create grid plot/i }).click()
    await page.getByLabel(/plot name/i).fill('Test Plot')
    await page.getByRole('button', { name: /create plot/i }).click()
    
    // Find the mobile plant tray header and verify it's clickable
    const plantTrayHeader = page.locator('text=Available Plants').first()
    await expect(plantTrayHeader).toBeVisible()
  })
})

test.describe('Grid Plotter - ViewSwitcher', () => {
  test('should have all four view options', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Create a plan
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    
    // Check all view options are present
    await expect(page.getByRole('button', { name: /list view/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /plot view/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /grid planner/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /calendar/i })).toBeVisible()
  })

  test('should highlight active view', async ({ page }) => {
    await page.goto('/garden-planner')
    
    // Create a plan
    await page.getByRole('button', { name: /new plan/i }).click()
    await page.getByPlaceholder(/plan name/i).fill('Test Garden')
    await page.getByRole('button', { name: /create/i }).click()
    
    // Initially list view should be active (has white background)
    const listButton = page.getByRole('button', { name: /list view/i })
    await expect(listButton).toHaveClass(/bg-white/)
    
    // Switch to grid view
    await page.getByRole('button', { name: /grid planner/i }).click()
    
    // Now grid planner should be active
    const gridButton = page.getByRole('button', { name: /grid planner/i })
    await expect(gridButton).toHaveClass(/bg-white/)
  })
})

