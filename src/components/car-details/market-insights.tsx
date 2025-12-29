
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface MarketInsightsProps {
  price: number
  make: string
  model: string
  year: number
}

export function MarketInsights({ price, make, model, year }: MarketInsightsProps) {
  // Mock market data logic
  // In a real app, this would come from an API
  const marketAverage = price * 1.05 // Assume market avg is slightly higher
  const difference = marketAverage - price
  const percentDiff = (difference / marketAverage) * 100
  
  let dealRating = 'Fair Deal'
  let dealColor = 'text-yellow-600'
  let Icon = Minus
  
  if (percentDiff > 5) {
    dealRating = 'Great Deal'
    dealColor = 'text-green-600'
    Icon = TrendingDown // Price is trending down relative to market
  } else if (percentDiff < -5) {
    dealRating = 'Above Market'
    dealColor = 'text-red-600'
    Icon = TrendingUp
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Market Price Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${dealColor}`} />
                <span className={`font-bold text-xl ${dealColor}`}>{dealRating}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              ${Math.abs(difference).toLocaleString()} {difference > 0 ? 'below' : 'above'} market average
            </p>
          </div>
          <Badge variant="outline" className="h-fit">
            National Avg
          </Badge>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>${(marketAverage * 0.8).toLocaleString()}</span>
                <span>${(marketAverage * 1.2).toLocaleString()}</span>
            </div>
            <div className="relative pt-2 pb-6">
                {/* Range Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full opacity-50"></div>
                
                {/* Current Price Marker */}
                <div 
                    className="absolute top-0 flex flex-col items-center transform -translate-x-1/2 transition-all"
                    style={{ left: `${Math.max(0, Math.min(100, 50 - (percentDiff * 2)))}%` }}
                >
                    <div className="h-3 w-0.5 bg-black dark:bg-white mb-1"></div>
                    <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                        You: ${price.toLocaleString()}
                    </div>
                </div>

                {/* Market Avg Marker */}
                <div 
                    className="absolute top-2 flex flex-col items-center transform -translate-x-1/2"
                    style={{ left: '50%' }}
                >
                     <div className="h-4 w-4 rounded-full border-2 border-white bg-black dark:bg-white shadow-sm"></div>
                </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
                Based on similar {year} {make} {model} listings nationwide.
            </p>
        </div>
      </CardContent>
    </Card>
  )
}
