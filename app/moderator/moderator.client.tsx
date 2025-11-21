"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export default function ModeratorClient() {
  const [localBubblers, setLocalBubblers] = useState<any[]>([])
  const [localReviews, setLocalReviews] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [q, setQ] = useState("")
  const [type, setType] = useState<'bubblers'|'reviews'|'users'|'logs'|'recent'>('bubblers')
  const [recentData, setRecentData] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'user'|'bubbler'|null>(null)
  const [modalData, setModalData] = useState<any>(null)

  async function fetchPage(t: typeof type, p = 1, l = 25, query = "") {
    try {
      const url = new URL('/api/moderator', location.origin)
      url.searchParams.set('type', t)
      url.searchParams.set('page', String(p))
      url.searchParams.set('limit', String(l))
      if (query) url.searchParams.set('q', query)

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error('Failed to fetch')
      const payload = await res.json()
      const items = payload.items || []
      if (t === 'bubblers') setLocalBubblers(items)
      if (t === 'reviews') setLocalReviews(items)
      if (t === 'users') setUsers(items)
      if (t === 'logs') setLogs(items)
      if (t === 'recent') setRecentData(payload)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchPage(type, page, limit, q) }, [type, page, limit, q])

  async function deleteBubbler(id: number) {
    if (!confirm(`Delete bubbler ${id}? This cannot be undone.`)) return
    const res = await fetch(`/api/waypoints/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('Failed to delete bubbler')
      return
    }
    setLocalBubblers(s => s.filter(b => b.id !== id))
  }

  async function deleteReview(id: number) {
    if (!confirm(`Delete review ${id}?`)) return
    const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('Failed to delete review')
      return
    }
    setLocalReviews(s => s.filter(r => r.id !== id))
  }

  async function patchBubbler(id: number, patch: Record<string, any>) {
    const res = await fetch(`/api/waypoints/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
    if (!res.ok) {
      alert('Failed to update bubbler')
      return
    }
    const updated = await res.json()
    setLocalBubblers(s => s.map(b => b.id === id ? updated : b))
  }

  async function editUser(id: string) {
    const current = users.find(u => u.id === id)
    if (!current) return alert('User not found')
    setModalType('user')
    setModalData(current)
    setModalOpen(true)
  }
  
  async function editBubbler(id: number) {
    const current = localBubblers.find(b => b.id === id)
    if (!current) return alert('Bubbler not found')
    setModalType('bubbler')
    setModalData(current)
    setModalOpen(true)
  }

  async function saveModal() {
    if (modalType === 'user' && modalData) {
      const id = modalData.id
      const data: any = {
        displayName: modalData.displayName,
        handle: modalData.handle,
        email: modalData.email,
        bio: modalData.bio,
        image: modalData.image,
        moderator: modalData.moderator,
        verified: modalData.verified,
        xp: modalData.xp
      }
      const res = await fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, data }) })
      if (!res.ok) return alert('Failed to save user')
      const updated = await res.json()
      setUsers(s => s.map(u => u.id === id ? updated : u))
      setModalOpen(false)
    }
    if (modalType === 'bubbler' && modalData) {
      const id = modalData.id
      const data: any = {
        name: modalData.name,
        latitude: modalData.latitude,
        longitude: modalData.longitude,
        description: modalData.description,
        amenities: modalData.amenities,
        image: modalData.image,
        maintainer: modalData.maintainer,
        region: modalData.region,
        addedByUserId: modalData.addedByUserId,
        approved: modalData.approved,
        verified: modalData.verified
      }
      const res = await fetch(`/api/waypoints/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) return alert('Failed to save bubbler')
      const updated = await res.json()
      setLocalBubblers(s => s.map(b => b.id === id ? updated : b))
      setModalOpen(false)
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3">
        <Select defaultValue={type} onValueChange={(v) => { setType(v as any); setPage(1) }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bubblers">Bubblers</SelectItem>
            <SelectItem value="reviews">Reviews</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="logs">Logs</SelectItem>
            <SelectItem value="recent">Recent</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1"><Input placeholder="Search" value={q} onChange={e => { setQ(e.target.value); setPage(1) }} /></div>
        <label className="ml-auto text-sm">Per page: <Select defaultValue={String(limit)} onValueChange={(v) => setLimit(Number(v))}><SelectTrigger className="w-24"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="25">25</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select></label>
      </div>

      {type === 'bubblers' && (
        <section>
          <h2 className="text-xl font-semibold">Bubblers ({localBubblers.length})</h2>
          <div className="mt-2 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Region</th>
                  <th>Maintainer</th>
                  <th>Approved</th>
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {localBubblers.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td><a className="text-blue-400 underline" href={`/waypoint/${b.id}`} target="_blank" rel="noreferrer">{b.name}</a></td>
                    <td>{b.region || '-'}</td>
                    <td>{b.maintainer || '-'}</td>
                    <td>{String(!!b.approved)}</td>
                    <td>{String(!!b.verified)}</td>
                    <td className="flex items-center gap-2">
                      <Button size="sm" variant="destructive" onClick={() => deleteBubbler(b.id)}>Delete</Button>
                      <Button size="sm" variant="ghost" onClick={() => editBubbler(b.id)}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {type === 'reviews' && (
        <section>
          <h2 className="text-xl font-semibold">Reviews ({localReviews.length})</h2>
          <div className="mt-2 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bubbler ID</th>
                  <th>Bubbler</th>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Display Name</th>
                  <th>Comment</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {localReviews.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.bubblerId}</td>
                    <td>{r.bubbler?.name || '-'}</td>
                    <td>{r.userId}</td>
                    <td>{r.user?.handle || '-'}</td>
                    <td>{r.user?.displayName || '-'}</td>
                    <td className="max-w-[40ch] break-words">{r.comment ? r.comment : '-'}</td>
                    <td>{r.rating}</td>
                    <td>
                      <Button size="sm" variant="destructive" onClick={() => deleteReview(r.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {type === 'users' && (
        <section>
          <h2 className="text-xl font-semibold">Users ({users.length})</h2>
          <div className="mt-2 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Handle</th>
                  <th>Display</th>
                  <th>Email</th>
                  <th>Moderator</th>
                  <th>Verified</th>
                  <th>XP</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.handle}</td>
                    <td>{u.displayName}</td>
                    <td>{u.email || '-'}</td>
                    <td>{String(!!u.moderator)}</td>
                    <td>{String(!!u.verified)}</td>
                    <td>{u.xp ?? 0}</td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
                    <td>
                      <Button size="sm" variant="outline" onClick={() => editUser(u.id)}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {type === 'logs' && (
        <section>
          <h2 className="text-xl font-semibold">Recent Logs ({logs.length})</h2>
          <div className="mt-2 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>Bubbler</th>
                  <th>User</th>
                  <th>Old Data</th>
                  <th>New Data</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l: any) => {
                  const oldStr = l.oldData ? JSON.stringify(l.oldData) : ''
                  const newStr = l.newData ? JSON.stringify(l.newData) : ''
                  const short = (s: string) => s.length > 200 ? s.slice(0, 200) + '…' : s
                  return (
                    <tr key={l.id}>
                      <td>{l.id}</td>
                      <td>{l.action}</td>
                      <td>{l.bubbler ? `${l.bubbler.id} — ${l.bubbler.name}` : l.bubblerId}</td>
                      <td>{l.user ? `${l.user.handle || l.user.displayName || l.user.id}` : (l.userId || '-')}</td>
                      <td className="max-w-[40ch] break-words"><pre className="whitespace-pre-wrap">{oldStr ? short(oldStr) : '-'}</pre></td>
                      <td className="max-w-[40ch] break-words"><pre className="whitespace-pre-wrap">{newStr ? short(newStr) : '-'}</pre></td>
                      <td>{l.createdAt ? new Date(l.createdAt).toLocaleString() : '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {type === 'recent' && recentData && (
        <section>
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
            <div>
              <h3 className="font-semibold">Recently Added Users</h3>
              <div className="mt-2 overflow-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr><th>ID</th><th>Handle</th><th>Display</th><th>Email</th><th>XP</th><th>Created</th></tr>
                  </thead>
                  <tbody>
                    {recentData.users?.map((u: any) => (
                      <tr key={u.id}><td>{u.id}</td><td>{u.handle}</td><td>{u.displayName}</td><td>{u.email || '-'}</td><td>{u.xp ?? 0}</td><td>{new Date(u.createdAt).toLocaleString()}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Recently Added Waypoints</h3>
              <div className="mt-2 overflow-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Region</th><th>Maintainer</th><th>Added By</th><th>Created</th></tr>
                  </thead>
                  <tbody>
                    {recentData.waypoints?.map((w: any) => (
                      <tr key={w.id}><td>{w.id}</td><td>{w.name}</td><td>{w.region || '-'}</td><td>{w.maintainer || '-'}</td><td>{w.addedBy?.handle || w.addedBy?.displayName || '-'}</td><td>{new Date(w.createdAt).toLocaleString()}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Recent Reviews</h3>
              <div className="mt-2 overflow-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr><th>ID</th><th>Bubbler</th><th>User</th><th>Rating</th><th>Comment</th><th>Created</th></tr>
                  </thead>
                  <tbody>
                    {recentData.reviews?.map((r: any) => (
                      <tr key={r.id}><td>{r.id}</td><td>{r.bubbler?.name || r.bubblerId}</td><td>{r.user?.handle || r.userId}</td><td>{r.rating}</td><td className="max-w-[30ch] break-words">{r.comment || '-'}</td><td>{new Date(r.createdAt).toLocaleString()}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Recent Edits</h3>
              <div className="mt-2 overflow-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr><th>ID</th><th>Bubbler</th><th>User</th><th>Action</th><th>When</th></tr>
                  </thead>
                  <tbody>
                    {recentData.edits?.map((e: any) => (
                      <tr key={e.id}><td>{e.id}</td><td>{e.bubbler?.name || e.bubblerId}</td><td>{e.user?.handle || e.userId}</td><td>{e.action}</td><td>{new Date(e.createdAt).toLocaleString()}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
        <div>Page {page}</div>
        <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalType === 'user' ? 'Edit User' : modalType === 'bubbler' ? 'Edit Bubbler' : 'Edit'}</DialogTitle>
            <DialogDescription>Modify fields and save.</DialogDescription>
          </DialogHeader>

          {modalType === 'user' && modalData && (
            <div className="space-y-3">
              <div>
                <Label>Display Name</Label>
                <Input value={modalData.displayName || ''} onChange={e => setModalData({ ...modalData, displayName: e.target.value })} />
              </div>
              <div>
                <Label>Handle</Label>
                <Input value={modalData.handle || ''} onChange={e => setModalData({ ...modalData, handle: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={modalData.email || ''} onChange={e => setModalData({ ...modalData, email: e.target.value })} />
              </div>
              <div>
                <Label>Bio</Label>
                <Input value={modalData.bio || ''} onChange={e => setModalData({ ...modalData, bio: e.target.value })} />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={modalData.image || ''} onChange={e => setModalData({ ...modalData, image: e.target.value })} />
              </div>
              <div>
                <Label>Moderator</Label>
                <Select defaultValue={modalData.moderator ? 'true' : 'false'} onValueChange={(v) => setModalData({ ...modalData, moderator: v === 'true' })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">true</SelectItem>
                    <SelectItem value="false">false</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Verified</Label>
                <Select defaultValue={modalData.verified ? 'true' : 'false'} onValueChange={(v) => setModalData({ ...modalData, verified: v === 'true' })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">true</SelectItem>
                    <SelectItem value="false">false</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>XP</Label>
                <Input type="number" value={modalData.xp ?? 0} onChange={e => setModalData({ ...modalData, xp: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Created At</Label>
                <div className="text-sm text-muted-foreground">{modalData.createdAt ? new Date(modalData.createdAt).toLocaleString() : '-'}</div>
              </div>
            </div>
          )}

          {modalType === 'bubbler' && modalData && (
            <div className="space-y-3">
              <div>
                <Label>ID</Label>
                <div className="text-sm">{modalData.id}</div>
              </div>
              <div>
                <Label>Name</Label>
                <Input value={modalData.name || ''} onChange={e => setModalData({ ...modalData, name: e.target.value })} />
              </div>
              <div>
                <Label>Latitude</Label>
                <Input type="number" value={modalData.latitude ?? ''} onChange={e => setModalData({ ...modalData, latitude: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input type="number" value={modalData.longitude ?? ''} onChange={e => setModalData({ ...modalData, longitude: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={modalData.description || ''} onChange={e => setModalData({ ...modalData, description: e.target.value })} />
              </div>
              <div>
                <Label>Amenities (comma separated)</Label>
                <Input value={(modalData.amenities && Array.isArray(modalData.amenities) ? modalData.amenities.join(',') : (modalData.amenities || ''))} onChange={e => setModalData({ ...modalData, amenities: e.target.value.includes(',') ? e.target.value.split(',').map(s => s.trim()) : e.target.value })} />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={modalData.image || ''} onChange={e => setModalData({ ...modalData, image: e.target.value })} />
              </div>
              <div>
                <Label>Maintainer</Label>
                <Input value={modalData.maintainer || ''} onChange={e => setModalData({ ...modalData, maintainer: e.target.value })} />
              </div>
              <div>
                <Label>Region</Label>
                <Input value={modalData.region || ''} onChange={e => setModalData({ ...modalData, region: e.target.value })} />
              </div>
              <div>
                <Label>Added By User ID</Label>
                <Input value={modalData.addedByUserId || ''} onChange={e => setModalData({ ...modalData, addedByUserId: e.target.value })} />
              </div>
              <div>
                <Label>Approved</Label>
                <Select defaultValue={modalData.approved ? 'true' : 'false'} onValueChange={(v) => setModalData({ ...modalData, approved: v === 'true' })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">true</SelectItem>
                    <SelectItem value="false">false</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Verified</Label>
                <Select defaultValue={modalData.verified ? 'true' : 'false'} onValueChange={(v) => setModalData({ ...modalData, verified: v === 'true' })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">true</SelectItem>
                    <SelectItem value="false">false</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Link</Label>
                <a className="text-blue-400 underline" href={`/waypoint/${modalData.id}`} target="_blank" rel="noreferrer">Open waypoint</a>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => saveModal()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
