'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CarFront, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export function TradeInForm() {
  const t = useTranslations('Tools')
  const tCommon = useTranslations('Common')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [valuation, setValuation] = useState<number | null>(null)

  const formSchema = z.object({
    registration: z.string().min(1, `${t('registrationPlate')} ${tCommon('required')}`),
    mileage: z.string().min(1, `${t('currentMileage')} ${tCommon('required')}`),
    condition: z.enum(['excellent', 'good', 'fair', 'poor']),
    make: z.string().min(1, `${t('make')} ${tCommon('required')}`),
    model: z.string().min(1, `${t('model')} ${tCommon('required')}`),
    year: z.string().min(4, `${t('year')} ${tCommon('required')}`),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    // Simulate API call to valuation service or Supabase Edge Function
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock logic for valuation
    const baseValue = 15000
    const conditionMultiplier = {
        excellent: 1.2,
        good: 1.0,
        fair: 0.8,
        poor: 0.5
    }
    
    const estimatedValue = baseValue * conditionMultiplier[values.condition]
    setValuation(estimatedValue)
    
    setIsSubmitting(false)
    toast.success(t('valuationComplete'))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CarFront className="h-5 w-5" />
          {t('valueYourTradeIn')}
        </CardTitle>
        <CardDescription>
          {t('tradeInDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {valuation !== null ? (
          <div className="text-center py-8 space-y-4">
            <h3 className="text-lg font-medium text-muted-foreground">{t('estimatedValue')}</h3>
            <p className="text-4xl font-bold text-primary">${valuation.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              {t('estimateDisclaimer')}
            </p>
            <Button onClick={() => {
                setValuation(null)
                form.reset()
            }} variant="outline">
                {t('valueAnotherCar')}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="registration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('registrationPlate')}</FormLabel>
                      <FormControl>
                        <Input placeholder="AB12 CDE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('currentMileage')}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 45000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('make')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. BMW" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('model')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 3 Series" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('year')}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 2019" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t('condition')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="excellent" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('excellent')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="good" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('good')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="fair" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('fair')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="poor" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('poor')}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('calculating')}
                  </>
                ) : (
                  t('getEstimate')
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
