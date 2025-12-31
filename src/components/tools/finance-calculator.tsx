'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Calculator, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useTranslations } from 'next-intl'

interface FinanceCalculatorProps {
  vehiclePrice: number
}

interface FinanceDefaults {
  interest_rate: number
  min_deposit_percent: number
  max_term_months: number
  default_term_months: number
}

export function FinanceCalculator({ vehiclePrice }: FinanceCalculatorProps) {
  const t = useTranslations('Tools')
  const [loading, setLoading] = useState(true)
  const [deposit, setDeposit] = useState(vehiclePrice * 0.1) // 10% default fallback
  const [term, setTerm] = useState(48) // 48 months default fallback
  const [interestRate, setInterestRate] = useState(6.9) // 6.9% APR default fallback
  const [defaults, setDefaults] = useState<FinanceDefaults>({
    interest_rate: 6.9,
    min_deposit_percent: 10,
    max_term_months: 72,
    default_term_months: 48
  })

  const supabase = createClient()

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'finance_defaults')
          .single()
        
        if (data && data.value) {
          const settings = data.value as FinanceDefaults
          setDefaults(settings)
          setInterestRate(settings.interest_rate)
          setTerm(settings.default_term_months)
          setDeposit(vehiclePrice * (settings.min_deposit_percent / 100))
        }
      } catch (error) {
        console.error('Failed to fetch finance settings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [vehiclePrice, supabase])

  const principal = vehiclePrice - deposit
  const monthlyRate = interestRate / 12 / 100
  
  let monthlyPayment = 0
  if (monthlyRate === 0) {
      monthlyPayment = principal / term
  } else {
      monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
  }

  if (loading) {
      return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    {t('financeCalculator')}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {t('financeCalculator')}
        </CardTitle>
        <CardDescription>
          {t('financeDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{t('vehiclePrice')}</Label>
            <span className="font-medium">${vehiclePrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{t('deposit')}</Label>
            <span className="font-medium">${deposit.toLocaleString()}</span>
          </div>
          <Slider
            value={[deposit]}
            min={0}
            max={vehiclePrice * 0.5}
            step={100}
            onValueChange={(vals) => setDeposit(vals[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{t('termMonths')}</Label>
            <span className="font-medium">{term} {t('months')}</span>
          </div>
          <Slider
            value={[term]}
            min={12}
            max={defaults.max_term_months}
            step={12}
            onValueChange={(vals) => setTerm(vals[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{t('interestRate')}</Label>
            <span className="font-medium">{interestRate}%</span>
          </div>
          <Slider
            value={[interestRate]}
            min={0}
            max={15}
            step={0.1}
            onValueChange={(vals) => setInterestRate(vals[0])}
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-end">
            <span className="text-muted-foreground font-medium">{t('estimatedPayment')}</span>
            <span className="text-3xl font-bold text-primary">${monthlyPayment.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
