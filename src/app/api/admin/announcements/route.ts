import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Announcement } from '../../announcements/route'

function getDataFile(request?: NextRequest): string {
  // Check if we're in test mode and have a worker ID header
  if (process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST_MODE === 'true' && request) {
    const workerHeader = request.headers.get('x-playwright-worker-id')
    if (workerHeader) {
      return path.join(process.cwd(), 'data', `announcements-test-${workerHeader}.json`)
    }
  }
  return path.join(process.cwd(), 'data', 'announcements.json')
}

async function readAnnouncements(dataFile: string): Promise<Announcement[]> {
  try {
    const data = await fs.readFile(dataFile, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const dataFile = getDataFile(request)
    const announcements = await readAnnouncements(dataFile)
    // Return all announcements (including inactive) sorted by creation date
    const sortedAnnouncements = [...announcements]
    sortedAnnouncements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json(sortedAnnouncements)
  } catch (error) {
    console.error('Error reading announcements for admin:', error)
    return NextResponse.json({ error: 'Failed to read announcements' }, { status: 500 })
  }
}
