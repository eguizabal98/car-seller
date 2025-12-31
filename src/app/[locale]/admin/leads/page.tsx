import { createClient } from '@/utils/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { getTranslations } from 'next-intl/server'

export default async function LeadsPage() {
  const t = await getTranslations('Admin')
  const supabase = await createClient()
  
  // Fetch bookings with user profiles and vehicle info
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles:user_id (full_name, email, phone_number),
      vehicles:vehicle_id (make, model)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('leads')}</h1>
        <p className="text-muted-foreground">{t('leadsDescription')}</p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('customer')}</TableHead>
              <TableHead>{t('vehicle')}</TableHead>
              <TableHead>{t('type')}</TableHead>
              <TableHead>{t('dateTime')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('createdAt')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(bookings || []).map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{booking.profiles?.full_name || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">{booking.profiles?.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {booking.vehicles ? `${booking.vehicles.make} ${booking.vehicles.model}` : t('deletedVehicle')}
                </TableCell>
                <TableCell className="capitalize">{booking.type.replace('_', ' ')}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{format(new Date(booking.booking_date), 'MMM dd, yyyy')}</span>
                    <span className="text-xs text-muted-foreground">{booking.time_slot}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(booking.created_at), 'MMM dd, HH:mm')}
                </TableCell>
              </TableRow>
            ))}
            {(!bookings || bookings.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {t('noLeadsFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
