'use client'

import { useCallback, useEffect, useState } from 'react'

export type AssignmentFile = {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  createdAt: string
}

export type Assignment = {
  id: string
  title: string
  description: string | null
  course: string | null
  files: AssignmentFile[]
  createdAt: string
  updatedAt: string
}

export type AssignmentInput = {
  title: string
  description?: string
  course?: string
  newFiles?: File[]  // files to add
  removeFileIds?: string[]  // existing file IDs to remove
}

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssignments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/assignments', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load assignments')
      const data = await res.json()
      setAssignments(data.assignments || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  const createAssignment = useCallback(
    async (input: AssignmentInput) => {
      const fd = new FormData()
      fd.append('title', input.title)
      if (input.description) fd.append('description', input.description)
      if (input.course) fd.append('course', input.course)
      ;(input.newFiles || []).forEach((f, i) => {
        fd.append(`file_${i}`, f)
      })

      const res = await fetch('/api/assignments', {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to create assignment')
      }
      const data = await res.json()
      setAssignments((prev) => [data.assignment, ...prev])
      return data.assignment as Assignment
    },
    []
  )

  const updateAssignment = useCallback(
    async (id: string, input: AssignmentInput) => {
      const fd = new FormData()
      fd.append('title', input.title)
      if (input.description !== undefined) fd.append('description', input.description)
      if (input.course !== undefined) fd.append('course', input.course)
      ;(input.newFiles || []).forEach((f, i) => {
        fd.append(`file_${i}`, f)
      })
      if (input.removeFileIds && input.removeFileIds.length > 0) {
        fd.append('removeFileIds', input.removeFileIds.join(','))
      }

      const res = await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        body: fd,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to update assignment')
      }
      const data = await res.json()
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? data.assignment : a))
      )
      return data.assignment as Assignment
    },
    []
  )

  const deleteAssignment = useCallback(async (id: string) => {
    const res = await fetch(`/api/assignments/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to delete assignment')
    }
    setAssignments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return {
    assignments,
    loading,
    error,
    refresh: fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  }
}
