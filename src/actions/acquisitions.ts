'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Acquisition, AcquisitionStage, ExpenseCategory, CreateVehicleParams } from '@/types/acquisitions'

export { type AcquisitionStage, type ExpenseCategory }

export async function getAcquisitions(): Promise<Acquisition[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('acquisitions')
    .select(`
      *,
      vehicle:vehicles(id, make, model, year, vin, status)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching acquisitions:', error)
    return []
  }

  return data as unknown as Acquisition[]
}

export async function getAcquisition(id: string): Promise<Acquisition | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('acquisitions')
    .select(`
      *,
      vehicle:vehicles(*),
      expenses(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching acquisition:', error)
    return null
  }

  return data as unknown as Acquisition
}

export async function createAcquisition(vehicleData: CreateVehicleParams) {
  const supabase = await createClient()

  // 1. Create Vehicle
  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .insert({
      ...vehicleData,
      status: 'coming_soon'
    })
    .select()
    .single()

  if (vehicleError) {
    console.error('Error creating vehicle:', vehicleError)
    throw new Error(`Failed to create vehicle: ${vehicleError.message}`)
  }

  // 2. Create Acquisition
  const { data: acquisition, error: acquisitionError } = await supabase
    .from('acquisitions')
    .insert({
      vehicle_id: vehicle.id,
      stage: 'auction',
      details: {}
    })
    .select()
    .single()

  if (acquisitionError) {
    console.error('Error creating acquisition:', acquisitionError)
    // Cleanup vehicle if acquisition fails?
    throw new Error('Failed to create acquisition')
  }

  revalidatePath('/admin/acquisitions')
  return acquisition
}

export async function updateAcquisitionStage(id: string, stage: AcquisitionStage, details: Record<string, any>) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('acquisitions')
    .update({ stage, details, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating acquisition stage:', error)
    throw new Error('Failed to update stage')
  }

  // If completed, update vehicle status to 'available'
  if (stage === 'completed') {
    const { data: acquisition } = await supabase.from('acquisitions').select('vehicle_id').eq('id', id).single()
    if (acquisition) {
      await supabase.from('vehicles').update({ status: 'available' }).eq('id', acquisition.vehicle_id)
    }
  }

  revalidatePath(`/admin/acquisitions/${id}`)
  revalidatePath('/admin/acquisitions')
}

export async function addExpense(acquisitionId: string, expense: { category: ExpenseCategory; amount: number; description?: string; date: string }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('expenses')
    .insert({
      acquisition_id: acquisitionId,
      ...expense
    })

  if (error) {
    console.error('Error adding expense:', error)
    throw new Error('Failed to add expense')
  }

  revalidatePath(`/admin/acquisitions/${acquisitionId}`)
}

export async function deleteExpense(id: string, acquisitionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting expense:', error)
    throw new Error('Failed to delete expense')
  }

  revalidatePath(`/admin/acquisitions/${acquisitionId}`)
}
