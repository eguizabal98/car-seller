
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Wallet, Droplets, Shield, Wrench } from 'lucide-react'

interface OwnershipCostsProps {
  price: number
  mpg?: number
}

export function OwnershipCosts({ price, mpg = 25 }: OwnershipCostsProps) {
  // Mock calculations
  const loanTerm = 60
  const interestRate = 0.05
  const downPayment = price * 0.1
  const loanAmount = price - downPayment
  const monthlyInterest = interestRate / 12
  const monthlyPayment = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, loanTerm)) / (Math.pow(1 + monthlyInterest, loanTerm) - 1)
  
  const fuelCost = (1000 / mpg) * 3.50 // 1000 miles/mo, $3.50/gal
  const insuranceCost = price * 0.004 // Rough estimate
  const maintenanceCost = 100 // Flat estimate

  const totalMonthly = monthlyPayment + fuelCost + insuranceCost + maintenanceCost

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Estimated Monthly Cost
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-2">
            <span className="text-3xl font-bold text-primary">${Math.round(totalMonthly).toLocaleString()}</span>
            <span className="text-muted-foreground">/mo</span>
        </div>

        <div className="space-y-3">
            <CostItem 
                label="Finance (Est.)" 
                value={monthlyPayment} 
                icon={Wallet}
                subtext={`${loanTerm}mo @ ${(interestRate * 100).toFixed(1)}%`}
            />
            <CostItem 
                label="Fuel / Charging" 
                value={fuelCost} 
                icon={Droplets}
                subtext={`@ ${mpg} MPG`}
            />
            <CostItem 
                label="Insurance" 
                value={insuranceCost} 
                icon={Shield}
                subtext="Avg. Driver"
            />
             <CostItem 
                label="Maintenance" 
                value={maintenanceCost} 
                icon={Wrench}
                subtext="Projected"
            />
        </div>

        <Separator />
        
        <p className="text-xs text-muted-foreground text-center">
            Estimates only. Actual costs may vary based on driving habits, location, and credit score.
        </p>
      </CardContent>
    </Card>
  )
}

function CostItem({ label, value, icon: Icon, subtext }: { label: string, value: number, icon: any, subtext?: string }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-md">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                    <p className="text-sm font-medium">{label}</p>
                    {subtext && <p className="text-[10px] text-muted-foreground">{subtext}</p>}
                </div>
            </div>
            <span className="font-semibold">${Math.round(value)}</span>
        </div>
    )
}
