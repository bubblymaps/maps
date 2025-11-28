import React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import ModeratorClient from './moderator.client'

export default async function ModeratorPage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.moderator) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">403 — Forbidden</h1>
        <p className="mt-3">You must be a moderator to access this page.</p>
      </div>
    )
  }

  // This page now uses a client component to fetch paginated/searchable data via the moderator API.
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Bubbly Maps | Admin Console</h1>
      <ModeratorClient />
    </div>
  )
}
