import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export interface Announcement {
  id: string
  type: 'delivery' | 'order' | 'tip' | 'event'
  title: string
  content: string
  author: string
  date: string
  priority: 'high' | 'medium' | 'low'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

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

async function ensureDataDir(dataFile: string) {
  const dataDir = path.dirname(dataFile)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readAnnouncements(dataFile: string): Promise<Announcement[]> {
  try {
    await ensureDataDir(dataFile)
    const data = await fs.readFile(dataFile, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeAnnouncements(dataFile: string, announcements: Announcement[]): Promise<void> {
  await ensureDataDir(dataFile)
  await fs.writeFile(dataFile, JSON.stringify(announcements, null, 2))
}

export async function GET(request: NextRequest) {
  try {
    const dataFile = getDataFile(request)
    const announcements = await readAnnouncements(dataFile)
    const activeAnnouncements = announcements
      .filter(a => a.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json(activeAnnouncements)
  } catch (error) {
    console.error('Error reading announcements:', error)
    return NextResponse.json({ error: 'Failed to read announcements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dataFile = getDataFile(request)
    const contentType = request.headers.get('content-type')
    
    if (!contentType?.includes('application/json')) {
      console.error('Invalid content type:', contentType)
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 })
    }
    
    let body;
    try {
      const rawBody = await request.text()
      
      if (!rawBody || rawBody.trim() === '') {
        console.error('Empty request body')
        return NextResponse.json({ error: 'Request body is empty' }, { status: 400 })
      }
      
      body = JSON.parse(rawBody)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }
    
    const { type, title, content, author, priority } = body

    if (!type || !title || !content || !author) {
      console.error('Missing required fields:', { type, title, content, author })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate announcement type
    const validTypes = ['delivery', 'order', 'tip', 'event']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid announcement type' }, { status: 400 })
    }

    // Validate priority level
    const validPriorities = ['high', 'medium', 'low']
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json({ error: 'Invalid priority level' }, { status: 400 })
    }

    const announcements = await readAnnouncements(dataFile)
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      type,
      title,
      content,
      author,
      date: new Date().toISOString().split('T')[0],
      priority: priority ?? 'medium',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    announcements.push(newAnnouncement)
    await writeAnnouncements(dataFile, announcements)

    return NextResponse.json(newAnnouncement, { status: 201 })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}
