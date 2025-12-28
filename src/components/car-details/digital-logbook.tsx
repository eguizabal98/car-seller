import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DigitalLogbook() {
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
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary" />
                <h4 className="font-semibold">Major Service - 10,000 mi</h4>
                <p className="text-sm text-muted-foreground">March 15, 2024 • Porsche Centre London</p>
                <p className="text-sm mt-1">Oil change, filter replacement, brake fluid flush, comprehensive check.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-muted-foreground" />
                <h4 className="font-semibold">Interim Service - 5,000 mi</h4>
                <p className="text-sm text-muted-foreground">August 10, 2023 • Porsche Specialist</p>
                <p className="text-sm mt-1">Oil change, tire rotation, visual inspection.</p>
              </div>
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
                 <span className="font-medium">1</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b">
                 <span className="text-muted-foreground">Owned Since</span>
                 <span className="font-medium">Jan 2023</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b">
                 <span className="text-muted-foreground">Last V5C Issue Date</span>
                 <span className="font-medium">15 Jan 2023</span>
               </div>
               <div className="flex justify-between items-center py-2">
                 <span className="text-muted-foreground">Keys Available</span>
                 <span className="font-medium">2 Sets</span>
               </div>
             </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
