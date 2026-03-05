import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function generateRoomId() {
  return Math.random().toString(36).slice(2, 10)
}

export function useRoom(roomId, user) {
  const [room, setRoom] = useState(null)
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const channelRef = useRef(null)

  useEffect(() => {
    if (!roomId) return
    setLoading(true)
    setError(null)

    fetchRoom()
    fetchApartments()
    subscribeToRoom()

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [roomId])

  async function fetchRoom() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (error || !data) {
      setError('Room not found or no longer available.')
      setLoading(false)
      return
    }
    setRoom(data)
  }

  async function fetchApartments() {
    const { data, error } = await supabase
      .from('room_apartments')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setApartments(data.map(row => ({ ...row.data, id: row.id, addedBy: row.added_by_name, roomRowId: row.id })))
    }
    setLoading(false)
  }

  function subscribeToRoom() {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'room_apartments',
        filter: `room_id=eq.${roomId}`,
      }, payload => {
        const row = payload.new
        setApartments(prev => {
          if (prev.some(a => a.id === row.id)) return prev
          return [{ ...row.data, id: row.id, addedBy: row.added_by_name, roomRowId: row.id }, ...prev]
        })
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'room_apartments',
        filter: `room_id=eq.${roomId}`,
      }, payload => {
        const row = payload.new
        setApartments(prev =>
          prev.map(a => a.id === row.id ? { ...row.data, id: row.id, addedBy: row.added_by_name, roomRowId: row.id } : a)
        )
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'room_apartments',
        filter: `room_id=eq.${roomId}`,
      }, payload => {
        setApartments(prev => prev.filter(a => a.id !== payload.old.id))
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`,
      }, payload => {
        setRoom(payload.new)
      })
      .subscribe()

    channelRef.current = channel
  }

  async function addApartment(data) {
    if (!user) throw new Error('Must be logged in')
    const now = new Date().toISOString()
    const id = generateId()
    const apartment = {
      id, name: '', address: '', rent: '', bedrooms: '', bathrooms: '',
      sqft: '', amenities: [], pros: [], cons: [], notes: '',
      status: 'considering', rating: 0, listingUrl: '',
      moveInDate: '', leaseLength: '', contact: '',
      createdAt: now, updatedAt: now,
      ...data,
    }

    const { error } = await supabase.from('room_apartments').insert({
      id,
      room_id: roomId,
      added_by: user.id,
      added_by_name: user.profile?.display_name ?? 'Unknown',
      data: apartment,
    })
    if (error) throw error
  }

  async function updateApartment(id, changes) {
    if (!user) throw new Error('Must be logged in')
    const existing = apartments.find(a => a.id === id)
    if (!existing) return
    const updated = { ...existing, ...changes, updatedAt: new Date().toISOString() }
    const { addedBy, roomRowId, ...apartmentData } = updated

    const { error } = await supabase
      .from('room_apartments')
      .update({ data: apartmentData, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  }

  async function deleteApartment(id) {
    if (!user) throw new Error('Must be logged in')
    const { error } = await supabase.from('room_apartments').delete().eq('id', id)
    if (error) throw error
  }

  async function updateAccess(access) {
    if (!user || room?.owner_id !== user.id) throw new Error('Only the room owner can change access')
    const { error } = await supabase.from('rooms').update({ access }).eq('id', roomId)
    if (error) throw error
  }

  return { room, apartments, loading, error, addApartment, updateApartment, deleteApartment, updateAccess }
}

export async function createRoom(name, access, userId) {
  const id = generateRoomId()
  const { error } = await supabase.from('rooms').insert({ id, name, owner_id: userId, access })
  if (error) throw error
  return id
}
