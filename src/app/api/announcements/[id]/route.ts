import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Announcement } from '../route'

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

async function writeAnnouncements(dataFile: string, announcements: Announcement[]): Promise<void> {
  const dataDir = path.dirname(dataFile)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  await fs.writeFile(dataFile, JSON.stringify(announcements, null, 2))
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const dataFile = getDataFile(request)
    const body = await request.json()
    const announcements = await readAnnouncements(dataFile)
    const index = announcements.findIndex(a => a.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
    }

    announcements[index] = {
      ...announcements[index],
      ...body,
      updatedAt: new Date().toISOString()
    }

    await writeAnnouncements(dataFile, announcements)
    return NextResponse.json(announcements[index])
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const dataFile = getDataFile(request)
    const announcements = await readAnnouncements(dataFile)
    const index = announcements.findIndex(a => a.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
    }

    // Soft delete by setting isActive to false
    announcements[index].isActive = false
    announcements[index].updatedAt = new Date().toISOString()

    await writeAnnouncements(dataFile, announcements)
    return NextResponse.json({ message: 'Announcement deleted successfully' })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 })
  }
}
