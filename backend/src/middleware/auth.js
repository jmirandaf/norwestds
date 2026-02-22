import { createClerkClient, verifyToken } from '@clerk/backend'
import { prisma } from '../db.js'

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : null

    if (!token) return res.status(401).json({ error: 'Missing bearer token' })

    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    })

    const clerkUserId = verified.sub
    if (!clerkUserId) return res.status(401).json({ error: 'Invalid token' })

    const clerkUser = await clerk.users.getUser(clerkUserId)
    const email = clerkUser.primaryEmailAddress?.emailAddress || ''

    let user = await prisma.user.findUnique({ where: { clerkUserId } })

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email,
          displayName: clerkUser.fullName || clerkUser.firstName || null,
          role: (clerkUser.publicMetadata?.role || 'client'),
        },
      })
    }

    req.auth = { clerkUserId }
    req.user = user
    next()
  } catch (error) {
    console.error('[AuthError]', error)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
