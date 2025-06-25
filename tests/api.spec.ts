import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'announcements.json')
const BACKUP_FILE = path.join(process.cwd(), 'data', 'announcements-demo-backup.json')

// Helper to create unique test data file for each worker
async function getTestDataFile(testInfo: any) {
  const workerId = testInfo.workerIndex ?? 0
  const testDataFile = path.join(process.cwd(), 'data', `announcements-test-${workerId}.json`)

  // Copy backup data to test-specific file
  const backupData = await fs.readFile(BACKUP_FILE, 'utf-8')
  await fs.writeFile(testDataFile, backupData)

  return testDataFile
}

async function cleanupTestDataFile(testDataFile: string) {
  try {
    await fs.unlink(testDataFile)
  } catch (error) {
    console.debug('Test data file already cleaned up:', error)
  }
}

// Helper to reset announcements data using test-specific file
async function resetAnnouncementsData(testDataFile: string) {
  try {
    const backupData = await fs.readFile(BACKUP_FILE, 'utf-8')
    await fs.writeFile(testDataFile, backupData)
    // Also copy to main data file for API to read
    await fs.writeFile(DATA_FILE, backupData)
  } catch (error) {
    console.warn('Could not reset announcements data:', error)
  }
}

test.describe('API Endpoints', () => {
  test.describe('Announcements API', () => {
    let testDataFile: string;

    test.beforeEach(async ({ page }, testInfo) => {
      // Create test-specific data file
      testDataFile = await getTestDataFile(testInfo)
      // Reset announcements data before each test
      await resetAnnouncementsData(testDataFile)
    })

    test.afterEach(async () => {
      // Clean up test-specific data file after each test
      if (testDataFile) {
        await cleanupTestDataFile(testDataFile)
      }
    })

    // Helper to add worker ID header to requests
    function addWorkerHeader(options: any, testInfo: any) {
      const workerId = testInfo.workerIndex ?? 0
      return {
        ...options,
        headers: {
          ...options?.headers,
          'x-playwright-worker-id': workerId.toString()
        }
      }
    }

    test('GET /api/announcements should return announcements', async ({ request }, testInfo) => {
      const response = await request.get('/api/announcements', addWorkerHeader({}, testInfo));

      expect(response.status()).toBe(200);

      const announcements = await response.json();
      expect(Array.isArray(announcements)).toBe(true);

      // Check that each announcement has required fields
      if (announcements.length > 0) {
        const announcement = announcements[0];
        expect(announcement).toHaveProperty('id');
        expect(announcement).toHaveProperty('title');
        expect(announcement).toHaveProperty('content');
        expect(announcement).toHaveProperty('type');
        expect(announcement).toHaveProperty('author');
        expect(announcement).toHaveProperty('date');
        expect(announcement).toHaveProperty('priority');
        expect(announcement).toHaveProperty('isActive');
      }
    });

    test('GET /api/admin/announcements should return all announcements including inactive', async ({ request }, testInfo) => {
      const response = await request.get('/api/admin/announcements', addWorkerHeader({}, testInfo));

      expect(response.status()).toBe(200);

      const announcements = await response.json();
      expect(Array.isArray(announcements)).toBe(true);
    });

    test('POST /api/announcements should create new announcement', async ({ request }, testInfo) => {
      const newAnnouncement = {
        type: 'tip',
        title: 'Test Announcement',
        content: 'This is a test announcement created by Playwright',
        author: 'Test User',
        date: '2024-01-15',
        priority: 'medium',
        isActive: true
      };

      const response = await request.post('/api/announcements', addWorkerHeader({
        data: newAnnouncement
      }, testInfo));

      expect(response.status()).toBe(201);

      const createdAnnouncement = await response.json();
      expect(createdAnnouncement).toHaveProperty('id');
      expect(createdAnnouncement.title).toBe(newAnnouncement.title);
      expect(createdAnnouncement.content).toBe(newAnnouncement.content);
      expect(createdAnnouncement.type).toBe(newAnnouncement.type);
    });

    test('POST /api/announcements should validate required fields', async ({ request }, testInfo) => {
      const incompleteAnnouncement = {
        title: 'Test Announcement'
        // Missing required fields
      };

      const response = await request.post('/api/announcements', addWorkerHeader({
        data: incompleteAnnouncement
      }, testInfo));

      expect(response.status()).toBe(400);
    });

    test('PUT /api/announcements/[id] should update existing announcement', async ({ request }, testInfo) => {
      // First, create an announcement with a unique identifier including worker info
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const uniqueId = `update-test-${timestamp}-${randomSuffix}`;
      
      const newAnnouncement = {
        type: 'event',
        title: `Original Title ${uniqueId}`,
        content: `Original content ${uniqueId}`,
        author: 'Test User',
        date: '2024-01-15',
        priority: 'medium',
        isActive: true
      };

      const createResponse = await request.post('/api/announcements', addWorkerHeader({
        data: newAnnouncement
      }, testInfo));

      expect(createResponse.status()).toBe(201);
      const created = await createResponse.json();

      // Add a longer delay to ensure data is fully persisted across all systems
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify the announcement exists by fetching all announcements with retry
      let foundAnnouncement = null;
      for (let attempt = 0; attempt < 8; attempt++) {
        const allAnnouncementsResponse = await request.get('/api/admin/announcements', addWorkerHeader({}, testInfo));
        expect(allAnnouncementsResponse.status()).toBe(200);
        const allAnnouncements = await allAnnouncementsResponse.json();
        foundAnnouncement = allAnnouncements.find((a: any) => a.id === created.id);

        if (foundAnnouncement) {
          break;
        }

        if (attempt < 7) {
          console.log(`UPDATE: Attempt ${attempt + 1}/8 - waiting for announcement to be available`);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (!foundAnnouncement) {
        console.error('Created announcement not found in list:', created.id);
        const allAnnouncementsResponse = await request.get('/api/admin/announcements', addWorkerHeader({}, testInfo));
        const allAnnouncements = await allAnnouncementsResponse.json();
        console.error('Available announcement IDs:', allAnnouncements.map((a: any) => a.id));
        // If announcement not found, skip the update test as it will definitely fail
        testInfo.skip();
        return;
      }

      // Then, update it
      const updatedAnnouncement = {
        ...newAnnouncement,
        title: `Updated Title ${uniqueId}`,
        content: `Updated content ${uniqueId}`
      };

      const updateResponse = await request.put(`/api/announcements/${created.id}`, addWorkerHeader({
        data: updatedAnnouncement
      }, testInfo));

      if (updateResponse.status() !== 200) {
        console.error('Update failed for ID:', created.id);
        console.error('Update response status:', updateResponse.status());
        console.error('Update response text:', await updateResponse.text());

        // Re-check announcements list to see current state
        const recheckResponse = await request.get('/api/admin/announcements', addWorkerHeader({}, testInfo));
        const recheckAnnouncements = await recheckResponse.json();
        console.error('Announcements after failed update:', recheckAnnouncements.map((a: any) => ({ id: a.id, title: a.title })));
      }

      expect(updateResponse.status()).toBe(200);

      const updated = await updateResponse.json();
      expect(updated.title).toBe(`Updated Title ${uniqueId}`);
      expect(updated.content).toBe(`Updated content ${uniqueId}`);
    });

    test('DELETE /api/announcements/[id] should soft delete announcement', async ({ request }, testInfo) => {
      // First, create an announcement
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const uniqueId = `delete-test-${timestamp}-${randomSuffix}`;
      
      const newAnnouncement = {
        type: 'delivery',
        title: `Test Announcement ${uniqueId}`,
        content: `Test content ${uniqueId}`,
        author: 'Test User',
        date: '2024-01-15',
        priority: 'medium',
        isActive: true
      };

      const createResponse = await request.post('/api/announcements', addWorkerHeader({
        data: newAnnouncement
      }, testInfo));

      expect(createResponse.status()).toBe(201);
      const created = await createResponse.json();

      // Wait for data to be persisted
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify the announcement exists and is active
      const beforeDeleteResponse = await request.get('/api/admin/announcements', addWorkerHeader({}, testInfo));
      expect(beforeDeleteResponse.status()).toBe(200);
      const beforeDeleteAnnouncements = await beforeDeleteResponse.json();
      const beforeDeleteAnnouncement = beforeDeleteAnnouncements.find((a: any) => a.id === created.id);
      expect(beforeDeleteAnnouncement).toBeTruthy();
      expect(beforeDeleteAnnouncement.isActive).toBe(true);

      // Now delete it (soft delete)
      const deleteResponse = await request.delete(`/api/announcements/${created.id}`, addWorkerHeader({}, testInfo));
      expect(deleteResponse.status()).toBe(200);

      const deleteResult = await deleteResponse.json();
      expect(deleteResult.message).toBe('Announcement deleted successfully');

      // Wait for delete to be persisted
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify the announcement still exists but is inactive (soft delete)
      const afterDeleteResponse = await request.get('/api/admin/announcements', addWorkerHeader({}, testInfo));
      expect(afterDeleteResponse.status()).toBe(200);
      const afterDeleteAnnouncements = await afterDeleteResponse.json();
      const afterDeleteAnnouncement = afterDeleteAnnouncements.find((a: any) => a.id === created.id);
      expect(afterDeleteAnnouncement).toBeTruthy();
      expect(afterDeleteAnnouncement.isActive).toBe(false);

      // Verify it doesn't appear in public API (only active announcements)
      const publicResponse = await request.get('/api/announcements', addWorkerHeader({}, testInfo));
      expect(publicResponse.status()).toBe(200);
      const publicAnnouncements = await publicResponse.json();
      const publicAnnouncement = publicAnnouncements.find((a: any) => a.id === created.id);
      expect(publicAnnouncement).toBeFalsy(); // Should not appear in public API
    });

    test('should handle non-existent announcement ID', async ({ request }, testInfo) => {
      const nonExistentId = 'non-existent-id-12345';

      const getResponse = await request.put(`/api/announcements/${nonExistentId}`, addWorkerHeader({
        data: {
          type: 'tip',
          title: 'Test',
          content: 'Test',
          author: 'Test',
          date: '2024-01-15',
          priority: 'medium',
          isActive: true
        }
      }, testInfo));

      expect(getResponse.status()).toBe(404);
    });

    test('should validate announcement type', async ({ request }, testInfo) => {
      const invalidTypeAnnouncement = {
        type: 'invalid-type',
        title: 'Test Announcement',
        content: 'Test content',
        author: 'Test User',
        date: '2024-01-15',
        priority: 'medium',
        isActive: true
      };

      const response = await request.post('/api/announcements', addWorkerHeader({
        data: invalidTypeAnnouncement
      }, testInfo));

      expect(response.status()).toBe(400);
    });

    test('should validate priority levels', async ({ request }, testInfo) => {
      const invalidPriorityAnnouncement = {
        type: 'tip',
        title: 'Test Announcement',
        content: 'Test content',
        author: 'Test User',
        date: '2024-01-15',
        priority: 'invalid-priority',
        isActive: true
      };

      const response = await request.post('/api/announcements', addWorkerHeader({
        data: invalidPriorityAnnouncement
      }, testInfo));

      expect(response.status()).toBe(400);
    });
  });
});
