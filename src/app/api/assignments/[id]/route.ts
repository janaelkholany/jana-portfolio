import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/app/api/auth/route'

type RouteParams = { params: Promise<{ id: string }> }

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB per file
const MAX_TOTAL_SIZE = 50 * 1024 * 1024 // 50MB total per assignment
const MAX_FILES_PER_ASSIGNMENT = 20

// GET /api/assignments/[id] - Get single assignment (public — anyone can download)
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const assignment = await db.assignment.findUnique({
      where: { id },
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
    if (!assignment) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const url = new URL(req.url)
    const download = url.searchParams.get('download')
    const fileId = url.searchParams.get('fileId')

    // If download requested for a specific file, stream that file
    if (download && fileId) {
      const file = await db.assignmentFile.findUnique({
        where: { id: fileId, assignmentId: id },
      })
      if (!file) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }
      const buffer = Buffer.from(file.fileData, 'base64')
      const headers = new Headers({
        'Content-Type': file.fileType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.fileName)}"`,
        'Content-Length': buffer.length.toString(),
      })
      return new NextResponse(buffer, { headers })
    }

    // Otherwise return metadata
    return NextResponse.json({ assignment })
  } catch (error) {
    console.error('Failed to fetch assignment:', error)
    return NextResponse.json({ error: 'Failed to fetch assignment' }, { status: 500 })
  }
}

// PUT /api/assignments/[id] - Update assignment (admin only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const token = req.cookies.get('admin_token')?.value
    if (!verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized — admin login required' },
        { status: 403 }
      )
    }
    const { id } = await params
    const existing = await db.assignment.findUnique({
      where: { id },
      include: { files: true },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const formData = await req.formData()
    const title = formData.get('title') as string
    const description = (formData.get('description') as string) ?? ''
    const course = (formData.get('course') as string) ?? ''

    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Collect new files
    const newFiles: File[] = []
    for (const [key, value] of formData.entries()) {
      if (
        (key === 'file' || key.startsWith('file_')) &&
        value instanceof File &&
        value.size > 0
      ) {
        newFiles.push(value)
      }
    }

    // Collect file IDs to remove (from "removeFileIds[]" entries)
    const removeFileIds: string[] = []
    for (const [key, value] of formData.entries()) {
      if (key === 'removeFileIds' && typeof value === 'string') {
        removeFileIds.push(...value.split(',').filter(Boolean))
      }
    }

    // Get current files to validate counts/sizes
    const currentFiles = existing.files
    const remainingCount =
      currentFiles.length -
      removeFileIds.filter((rid) => currentFiles.some((f) => f.id === rid)).length

    if (remainingCount + newFiles.length > MAX_FILES_PER_ASSIGNMENT) {
      return NextResponse.json(
        { error: `You can have up to ${MAX_FILES_PER_ASSIGNMENT} files per assignment` },
        { status: 400 }
      )
    }

    if (newFiles.length > 0) {
      for (const f of newFiles) {
        if (f.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `File "${f.name}" exceeds 10MB limit` },
            { status: 400 }
          )
        }
      }
      // Validate total of remaining + new files
      const remainingSize = currentFiles
        .filter((f) => !removeFileIds.includes(f.id))
        .reduce((sum, f) => sum + f.fileSize, 0)
      const newTotal = remainingSize + newFiles.reduce((s, f) => s + f.size, 0)
      if (newTotal > MAX_TOTAL_SIZE) {
        return NextResponse.json(
          { error: `Total file size must be less than ${Math.floor(MAX_TOTAL_SIZE / 1024 / 1024)}MB` },
          { status: 400 }
        )
      }
    }

    // Read new files as base64 records
    const newFileRecords = await Promise.all(
      newFiles.map(async (f) => {
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

    // Transaction: update assignment + remove requested files + add new files
    const updated = await db.$transaction(async (tx) => {
      // Update assignment metadata
      await tx.assignment.update({
        where: { id },
        data: {
          title: title.trim(),
          description: description.trim() || null,
          course: course.trim() || null,
        },
      })

      // Delete requested files
      if (removeFileIds.length > 0) {
        await tx.assignmentFile.deleteMany({
          where: {
            id: { in: removeFileIds },
            assignmentId: id,
          },
        })
      }

      // Add new files
      if (newFileRecords.length > 0) {
        await tx.assignmentFile.createMany({
          data: newFileRecords.map((r) => ({ ...r, assignmentId: id })),
        })
      }

      return tx.assignment.findUnique({
        where: { id },
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
    })

    return NextResponse.json({ assignment: updated })
  } catch (error) {
    console.error('Failed to update assignment:', error)
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 })
  }
}

// DELETE /api/assignments/[id] - Delete assignment (admin only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const token = req.cookies.get('admin_token')?.value
    if (!verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized — admin login required' },
        { status: 403 }
      )
    }
    const { id } = await params
    const existing = await db.assignment.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    // Cascade delete will remove files automatically
    await db.assignment.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete assignment:', error)
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 })
  }
}
