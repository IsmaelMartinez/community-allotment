import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Announcement } from '../../announcements/route'

const DATA_FILE = path.join(process.cwd(), 'data', 'announcements.json')

async function readAnnouncements(): Promise<Announcement[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function GET() {
  try {
    const announcements = await readAnnouncements()
    // Return all announcements (including inactive) sorted by creation date
    const sortedAnnouncements = [...announcements]
    sortedAnnouncements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json(sortedAnnouncements)
  } catch (error) {
    console.error('Error reading announcements for admin:', error)
    return NextResponse.json({ error: 'Failed to read announcements' }, { status: 500 })
  }
}
