import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/app/api/auth/route'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB per file
const MAX_TOTAL_SIZE = 50 * 1024 * 1024 // 50MB total per assignment
const MAX_FILES_PER_ASSIGNMENT = 20

// GET /api/assignments - List all assignments (public — anyone can view)
export async function GET() {
  try {
    const assignments = await db.assignment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        files: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
    // Strip fileData from files (already excluded via select)
    return NextResponse.json({ assignments })
  } catch (error) {
    console.error('Failed to fetch assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}

// POST /api/assignments - Create a new assignment (admin only)
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value
    if (!verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized — admin login required' },
        { status: 403 }
      )
    }

    const formData = await req.formData()
    const title = formData.get('title') as string
    const description = (formData.get('description') as string) || ''
    const course = (formData.get('course') as string) || ''

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Collect all files (named "file" or "file_0", "file_1", etc.)
    const files: File[] = []
    for (const [key, value] of formData.entries()) {
      if (
        (key === 'file' || key.startsWith('file_')) &&
        value instanceof File &&
        value.size > 0
      ) {
        files.push(value)
      }
    }

    if (files.length > MAX_FILES_PER_ASSIGNMENT) {
      return NextResponse.json(
        { error: `You can attach up to ${MAX_FILES_PER_ASSIGNMENT} files per assignment` },
        { status: 400 }
      )
    }

    const totalSize = files.reduce((sum, f) => sum + f.size, 0)
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: `Total file size must be less than ${Math.floor(MAX_TOTAL_SIZE / 1024 / 1024)}MB` },
        { status: 400 }
      )
    }

    // Validate each file individually
    for (const f of files) {
      if (f.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${f.name}" exceeds 10MB limit` },
          { status: 400 }
        )
      }
    }

    // Read file contents as base64
    const fileRecords = await Promise.all(
      files.map(async (f) => {
        const arrayBuffer = await f.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        return {
          fileName: f.name,
          fileData: buffer.toString('base64'),
          fileType: f.type || 'application/octet-stream',
          fileSize: f.size,
        }
      })
    )

    const assignment = await db.assignment.create({
      data: {
        title: title.trim(),
        description: description.trim() || null,
        course: course.trim() || null,
        files: {
          create: fileRecords,
        },
      },
      include: {
        files: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            createdAt: true,
          },
        },
      },
    })

    return NextResponse.json({ assignment })
  } catch (error) {
    console.error('Failed to create assignment:', error)
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}
