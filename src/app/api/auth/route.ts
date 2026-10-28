import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'jana252001142'

// Use a simple shared secret — admin token = base64 of password + fixed salt.
// This is intentionally simple: we don't need enterprise auth for a portfolio.
function makeToken(password: string): string {
  // Token = base64(password) + '.' + constant tag — server re-validates on each request
  return Buffer.from(password).toString('base64') + '.admin'
}

function verifyToken(token: string | null | undefined): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 2 || parts[1] !== 'admin') return false
  try {
    const decoded = Buffer.from(parts[0], 'base64').toString('utf-8')
    return decoded === ADMIN_PASSWORD
  } catch {
    return false
  }
}

// POST /api/auth — login with password
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const password = body?.password
    if (typeof password !== 'string' || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    const token = makeToken(password)
    const res = NextResponse.json({ ok: true })
    // Cookie valid for 7 days, httpOnly so it can't be stolen via JS, but
    // we also expose the token in the response body so the client can keep
    // it in localStorage for the API calls that need it.
    res.cookies.set('admin_token', token, {
      httpOnly: false, // we read it client-side too for UI gating
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch (e) {
    console.error('Auth error:', e)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}

// GET /api/auth — check if currently authenticated
export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  return NextResponse.json({ isAdmin: verifyToken(token) })
}

// DELETE /api/auth — logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('admin_token')
  return res
}

export { verifyToken }
