'use client'

import { useCallback, useEffect, useState } from 'react'

type AdminState = {
  isAdmin: boolean
  loading: boolean
  login: (password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export function useAdmin(): AdminState {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setIsAdmin(!!data.isAdmin)
      } else {
        setIsAdmin(false)
      }
    } catch {
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(
    async (password: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        })
        if (res.ok) {
          setIsAdmin(true)
          return { ok: true }
        }
        const data = await res.json().catch(() => ({}))
        return { ok: false, error: data.error || 'Invalid password' }
      } catch {
        return { ok: false, error: 'Failed to login' }
      }
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
    } catch {
      // ignore
    }
    setIsAdmin(false)
  }, [])

  return { isAdmin, loading, login, logout, refresh }
}
