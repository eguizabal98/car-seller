import { FinanceCalculator } from '@/components/tools/finance-calculator'
import { TradeInForm } from '@/components/tools/trade-in-form'
import { Separator } from '@/components/ui/separator'

export const metadata = {
  title: 'Finance & Trade-In | CarSeller',
  description: 'Calculate your monthly payments and value your trade-in vehicle.',
}

export default function FinancePage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Finance & Trade-In</h1>
        <p className="text-muted-foreground">
          Flexible financing options tailored to your needs.
        </p>
      </div>
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <h2 className="text-xl font-semibold mb-4">Payment Calculator</h2>
            <p className="text-muted-foreground mb-6">
                Use our calculator to estimate your monthly payments. Adjust the deposit, term, and interest rate to find a plan that works for you.
            </p>
            <FinanceCalculator vehiclePrice={50000} />
        </div>
        
        <div>
            <h2 className="text-xl font-semibold mb-4">Trade-In Valuation</h2>
            <p className="text-muted-foreground mb-6">
                Looking to upgrade? Get an instant estimate for your current vehicle. We offer competitive trade-in values to help you get behind the wheel of your dream car sooner.
            </p>
            <TradeInForm />
        </div>
      </div>
    </div>
  )
}
