export type AcquisitionStage = 'auction' | 'transport' | 'repair' | 'legalization' | 'completed'

export type ExpenseCategory = 'purchase_price' | 'auction_fee' | 'transport_fee' | 'repair_cost' | 'legalization_fee' | 'parts' | 'labor' | 'other'

export interface Expense {
    id: string
    acquisition_id: string
    category: ExpenseCategory
    amount: number
    description?: string
    date: string
    created_at: string
}

export interface Acquisition {
    id: string
    vehicle_id: string
    stage: AcquisitionStage
    details: Record<string, any>
    created_at: string
    updated_at: string
    vehicle: {
        id: string
        make: string
        model: string
        year: number
        vin?: string
        status: string
        color?: string
    }
    expenses?: Expense[]
}

export interface CreateVehicleParams {
    make: string
    model: string
    year: number
    vin?: string
    color?: string
    price: number
    mileage: number
    fuel_type: string
    transmission: string
    body_type: string
}
