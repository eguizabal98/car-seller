'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { updateVehicle, createVehicle } from '@/app/[locale]/admin/inventory/actions'
import { MediaUploader, MediaItem } from '@/components/admin/media-uploader'

interface VehicleFormProps {
  vehicle?: any
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const t = useTranslations('Admin')
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const vehicleSchema = z.object({
    make: z.string().min(1, t('makeRequired')),
    model: z.string().min(1, t('modelRequired')),
    year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    price: z.coerce.number().min(0, t('pricePositive')),
    status: z.enum(['available', 'sold', 'reserved']),
    mileage: z.coerce.number().min(0).optional(),
    color: z.string().optional(),
    transmission: z.string().optional(),
    fuel_type: z.string().optional(),
    body_type: z.string().min(1, t('bodyTypeRequired')),
    owners: z.coerce.number().min(0).default(1),
    vin: z.string().optional(),
    description: z.string().optional(),
    // Extended specs (stored in features JSON)
    engine: z.string().optional(),
    drivetrain: z.string().optional(),
    interior_color: z.string().optional(),
    mpg: z.string().optional(),
    stock_no: z.string().optional(),
    doors: z.coerce.number().min(2).max(6).optional(),
    amenities: z.string().optional(), // Comma separated string for input
    // Logbook fields
    owned_since: z.string().optional(),
    v5c_issue_date: z.string().optional(),
    keys_available: z.coerce.number().min(0).optional(),
    inspection_report_url: z.string().url(t('validUrl')).optional().or(z.literal('')),
  })

  type VehicleFormValues = z.infer<typeof vehicleSchema>

  const features = (vehicle?.features as Record<string, any>) || {}
  const amenitiesList = (features.amenities as string[]) || []

  const [media, setMedia] = useState<MediaItem[]>(
    (vehicle?.media as any[])?.map(m => ({
      id: m.id,
      url: m.url,
      type: m.type as 'image' | 'video',
      is_primary: m.is_primary || false,
      caption: m.caption || ''
    })) || []
  )

  // Cast default values to avoid type mismatch with enum/optional fields
  const defaultValues: Partial<VehicleFormValues> = {
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    price: vehicle?.price || 0,
    status: (vehicle?.status as "available" | "sold" | "reserved") || 'available',
    mileage: vehicle?.mileage || 0,
    color: vehicle?.color || '',
    transmission: vehicle?.transmission || '',
    fuel_type: vehicle?.fuel_type || '',
    body_type: vehicle?.body_type || '',
    owners: vehicle?.owners || 1,
    vin: vehicle?.vin || '',
    description: vehicle?.description || '',
    // Features
    engine: features.engine || '',
    drivetrain: features.drivetrain || '',
    interior_color: features.interior_color || '',
    mpg: features.mpg || '',
    stock_no: features.stock_no || '',
    doors: features.doors || 4,
    amenities: amenitiesList.join(', '),
    // Logbook
    owned_since: features.owned_since || '',
    v5c_issue_date: features.v5c_issue_date || '',
    keys_available: features.keys_available || 2,
    inspection_report_url: features.inspection_report_url || '',
  }

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema) as any,
    defaultValues,
  })

  async function onSubmit(data: VehicleFormValues) {
    setIsSubmitting(true)
    try {
      // Separate standard columns from feature fields
      const {
        engine,
        drivetrain,
        interior_color,
        mpg,
        stock_no,
        doors,
        amenities,
        owned_since,
        v5c_issue_date,
        keys_available,
        inspection_report_url,
        ...standardData
      } = data

      // Parse amenities string back to array
      const amenitiesArray = amenities
        ? amenities.split(',').map(item => item.trim()).filter(Boolean)
        : []

      const features = {
        ...(vehicle?.features as object || {}),
        engine,
        drivetrain,
        interior_color,
        mpg,
        stock_no,
        doors,
        amenities: amenitiesArray,
        owned_since,
        v5c_issue_date,
        keys_available,
        inspection_report_url
      }

      if (vehicle) {
        await updateVehicle(vehicle.id, {
          ...standardData,
          features,
          media
        })
        toast.success(t('vehicleUpdated'))
      } else {
        await createVehicle({
          ...standardData,
          features,
          media
        })
        toast.success(t('vehicleCreated'))
      }

      router.push('/admin/inventory')
    } catch (error) {
      console.error('Error saving vehicle:', error)
      toast.error(t('failedToSave'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('make')}</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota" {...field} />
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
                  <Input placeholder="Camry" {...field} />
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
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('price')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectStatus')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('mileage')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transmission')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectTransmission')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fuel_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fuelType')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectFuelType')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('exteriorColor')}</FormLabel>
                <FormControl>
                  <Input placeholder="Silver" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interior_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('interiorColor')}</FormLabel>
                <FormControl>
                  <Input placeholder="Black Leather" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('bodyType')}</FormLabel>
                <FormControl>
                  <Input placeholder="SUV, Sedan, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="owners"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('previousOwners')}</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vin')}</FormLabel>
                <FormControl>
                  <Input placeholder="Vehicle Identification Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('stockNumber')}</FormLabel>
                <FormControl>
                  <Input placeholder="Stock #" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="engine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('engine')}</FormLabel>
                <FormControl>
                  <Input placeholder="2.0L 4-Cylinder" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="drivetrain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('drivetrain')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectDrivetrain')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FWD">FWD</SelectItem>
                    <SelectItem value="RWD">RWD</SelectItem>
                    <SelectItem value="AWD">AWD</SelectItem>
                    <SelectItem value="4WD">4WD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mpg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('mpgRange')}</FormLabel>
                <FormControl>
                  <Input placeholder="25 city / 32 hwy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="doors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('doors')}</FormLabel>
                <FormControl>
                  <Input type="number" min={2} max={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keys_available"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('keysAvailable')}</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="inspection_report_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inspectionReportUrl')}</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/report.pdf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <MediaUploader
            initialMedia={media}
            onChange={setMedia}
            vehicleId={vehicle?.id}
          />
        </div>

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('featuresAndAmenities')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Sunroof, Navigation, Heated Seats, Bluetooth, Backup Camera..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">{t('separateFeatures')}</p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Vehicle description..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/inventory')}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {vehicle ? t('updateVehicle') : t('createVehicle')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
