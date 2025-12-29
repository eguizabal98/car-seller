'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { format } from 'date-fns'

interface ServiceRecord {
  id: string
  date: string
  service_type: string
  description: string
  provider: string
  mileage: number
}

interface DigitalLogbookProps {
  vehicleId?: string
  owners?: number
  ownedSince?: string
  lastV5C?: string
  keys?: number
  reportUrl?: string
}

export function DigitalLogbook({ 
  vehicleId, 
  owners = 1,
  ownedSince = 'Jan 2023',
  lastV5C = '15 Jan 2023',
  keys = 2,
  reportUrl
}: DigitalLogbookProps) {
  const [history, setHistory] = useState<ServiceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchHistory() {
      if (!vehicleId) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('service_history')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('date', { ascending: false })

      if (!error && data) {
        setHistory(data)
      }
      setLoading(false)
    }

    fetchHistory()
  }, [vehicleId, supabase])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Digital Logbook
        </CardTitle>
        <CardDescription>
          Complete history and documentation for total transparency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="service" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="service">Service History</TabsTrigger>
            <TabsTrigger value="inspection">Inspection</TabsTrigger>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
          </TabsList>
          
          <TabsContent value="service" className="space-y-4 mt-4">
            <div className="border-l-2 border-muted pl-4 space-y-6">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading history...</div>
              ) : history.length > 0 ? (
                history.map((record, index) => (
                  <div key={record.id} className="relative">
                    <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`} />
                    <h4 className="font-semibold">{record.service_type} - {record.mileage.toLocaleString()} mi</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(record.date), 'MMMM d, yyyy')} • {record.provider}
                    </p>
                    <p className="text-sm mt-1">{record.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No service history available for this vehicle.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inspection" className="mt-4">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900 mb-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold mb-2">
                <CheckCircle className="h-5 w-5" />
                150-Point Inspection Passed
              </div>
              <p className="text-sm text-green-800 dark:text-green-300">
                This vehicle has passed our rigorous mechanical and cosmetic inspection standards.
              </p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" />
              Download Full Report (PDF)
            </Button>
          </TabsContent>

          <TabsContent value="ownership" className="mt-4">
             <div className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b">
                 <span className="text-muted-foreground">Previous Owners</span>
                 <span className="font-medium">{owners}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b">
                 <span className="text-muted-foreground">Owned Since</span>
                 <span className="font-medium">{ownedSince}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b">
                 <span className="text-muted-foreground">Last V5C Issue Date</span>
                 <span className="font-medium">{lastV5C}</span>
               </div>
               <div className="flex justify-between items-center py-2">
                 <span className="text-muted-foreground">Keys Available</span>
                 <span className="font-medium">{keys} Sets</span>
               </div>
             </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
