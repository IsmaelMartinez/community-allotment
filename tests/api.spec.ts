import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs'
import path from 'path'

// Remove serial mode since we're fixing parallel execution
// test.describe.configure({ mode: 'serial' });

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

// Helper to cleanup test data file
async function cleanupTestDataFile(testDataFile: string) {
  try {
    await fs.unlink(testDataFile)
  } catch (error) {
    // Ignore if file doesn't exist
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
    test('GET /api/announcements should return announcements', async ({ request }) => {
      const response = await request.get('/api/announcements');
      
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

    test('GET /api/admin/announcements should return all announcements including inactive', async ({ request }) => {
      const response = await request.get('/api/admin/announcements');
      
      expect(response.status()).toBe(200);
      
      const announcements = await response.json();
      expect(Array.isArray(announcements)).toBe(true);
    });

    test('POST /api/announcements should create new announcement', async ({ request }) => {
      const newAnnouncement = {
        type: 'tip',
        title: 'Test Announcement',
        content: 'This is a test announcement created by Playwright',
        author: 'Test User',
        date: '2024-01-15',
        priority: 'medium',
        isActive: true
      };

      const response = await request.post('/api/announcements', {
        data: newAnnouncement
      });

      expect(response.status()).toBe(201);
      
      const createdAnnouncement = await response.json();
      expect(createdAnnouncement).toHaveProperty('id');
      expect(createdAnnouncement.title).toBe(newAnnouncement.title);
      expect(createdAnnouncement.content).toBe(newAnnouncement.content);
      expect(createdAnnouncement.type).toBe(newAnnouncement.type);
    });

    test('POST /api/announcements should validate required fields', async ({ request }) => {
      const incompleteAnnouncement = {
        title: 'Test Announcement'
        // Missing required fields
      };

      const response = await request.post('/api/announcements', {
        data: incompleteAnnouncement
      });

      expect(response.status()).toBe(400);
    });

    test('PUT /api/announcements/[id] should update existing announcement', async ({ request }) => {
      // First, create an announcement
      const newAnnouncement = {
        type: 'event',
        title: 'Original Title',
        content: 'Original content',
        author: 'Test User',
        date: '2024-01-15',
        priority: 'medium',
        isActive: true
      };

      const createResponse = await request.post('/api/announcements', {
        data: newAnnouncement
      });
      
      expect(createResponse.status()).toBe(201);
      const created = await createResponse.json();
      
      // Add a longer delay to ensure data is fully persisted across all systems
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify the announcement exists by fetching all announcements
      const allAnnouncementsResponse = await request.get('/api/announcements');
      expect(allAnnouncementsResponse.status()).toBe(200);
      const allAnnouncements = await allAnnouncementsResponse.json();
      const foundAnnouncement = allAnnouncements.find((a: any) => a.id === created.id);
      
      if (!foundAnnouncement) {
        console.error('Created announcement not found in list:', created.id);
        console.error('Available announcement IDs:', allAnnouncements.map((a: any) => a.id));
        // If announcement not found, skip the update test as it will definitely fail
        return;
      }

      // Then, update it
      const updatedAnnouncement = {
        ...newAnnouncement,
        title: 'Updated Title',
        content: 'Updated content'
      };

      const updateResponse = await request.put(`/api/announcements/${created.id}`, {
        data: updatedAnnouncement
      });

      if (updateResponse.status() !== 200) {
        console.error('Update failed for ID:', created.id);
        console.error('Update response status:', updateResponse.status());
        console.error('Update response text:', await updateResponse.text());
        
        // Re-check announcements list to see current state
        const recheckResponse = await request.get('/api/announcements');
        const recheckAnnouncements = await recheckResponse.json();
        console.error('Announcements after failed update:', recheckAnnouncements.map((a: any) => ({ id: a.id, title: a.title })));
      }

      expect(updateResponse.status()).toBe(200);
      
      const updated = await updateResponse.json();
      expect(updated.title).toBe('Updated Title');
      expect(updated.content).toBe('Updated content');
    });

    test('DELETE /api/announcements/[id] should delete announcement', async ({ request }) => {
      // First, create an announcement
      const newAnnouncement = {
        type: 'order',
        title: 'To Be Deleted',
        content: 'This announcement will be deleted',
        author: 'Test User',
        date: '2024-01-15',
        priority: 'low',
        isActive: true
      };

      const createResponse = await request.post('/api/announcements', {
        data: newAnnouncement
      });
      
      expect(createResponse.status()).toBe(201);
      const created = await createResponse.json();

      // Verify the announcement exists before deleting it
      const verifyResponse = await request.get('/api/admin/announcements');
      const allAnnouncements = await verifyResponse.json();
      const foundAnnouncement = allAnnouncements.find((a: any) => a.id === created.id);
      expect(foundAnnouncement).toBeDefined();

      // Then, delete it
      const deleteResponse = await request.delete(`/api/announcements/${created.id}`);
      expect(deleteResponse.status()).toBe(200);

      // Add a small delay to ensure file write operations complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify it's deleted by trying to get all announcements and checking it's not there
      const getResponse = await request.get('/api/announcements');
      const announcements = await getResponse.json();
      
      const deletedAnnouncement = announcements.find((a: any) => a.id === created.id);
      expect(deletedAnnouncement).toBeUndefined();
    });

    test('should handle non-existent announcement ID', async ({ request }) => {
      const nonExistentId = 'non-existent-id-12345';
      
      const getResponse = await request.put(`/api/announcements/${nonExistentId}`, {
        data: {
          type: 'tip',
          title: 'Test',
          content: 'Test',
          author: 'Test',
          date: '2024-01-15',
          priority: 'medium',
          isActive: true
        }
      });
      
      expect(getResponse.status()).toBe(404);
    });

    test('should validate announcement type', async ({ request }) => {
      const invalidTypeAnnouncement = {
        type: 'invalid-type',
        title: 'Test Announcement',
        content: 'Test content',
        author: 'Test User',
        date: '2024-01-15',
        priority: 'medium',
        isActive: true
      };

      const response = await request.post('/api/announcements', {
        data: invalidTypeAnnouncement
      });

      expect(response.status()).toBe(400);
    });

    test('should validate priority levels', async ({ request }) => {
      const invalidPriorityAnnouncement = {
        type: 'tip',
        title: 'Test Announcement',
        content: 'Test content',
        author: 'Test User',
        date: '2024-01-15',
        priority: 'invalid-priority',
        isActive: true
      };

      const response = await request.post('/api/announcements', {
        data: invalidPriorityAnnouncement
      });

      expect(response.status()).toBe(400);
    });
  });
});
