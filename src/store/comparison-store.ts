import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Car } from '@/components/inventory/car-card'

interface ComparisonState {
  cars: Car[]
  addCar: (car: Car) => void
  removeCar: (carId: string) => void
  clear: () => void
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set) => ({
      cars: [],
      addCar: (car) =>
        set((state) => {
          if (state.cars.some((c) => c.id === car.id)) return state
          if (state.cars.length >= 3) return state // Limit to 3 cars
          return { cars: [...state.cars, car] }
        }),
      removeCar: (carId) =>
        set((state) => ({
          cars: state.cars.filter((c) => c.id !== carId),
        })),
      clear: () => set({ cars: [] }),
    }),
    {
      name: 'comparison-storage',
    }
  )
)
