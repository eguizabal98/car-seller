import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, Clock, User, Phone, Mail, Car } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface BookingDetailDialogProps {
  booking: any
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function BookingDetailDialog({
  booking,
  isOpen,
  onClose,
  onUpdate,
}: BookingDetailDialogProps) {
  const t = useTranslations('Admin')
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()

  if (!booking) return null

  const handleStatusUpdate = async (status: string) => {
    setIsUpdating(true)
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', booking.id)

    if (error) {
      toast.error(t('statusUpdateError'))
    } else {
      toast.success(t('statusUpdated', { status }))
      onUpdate()
      onClose()
    }
    setIsUpdating(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('bookingDetails')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{format(new Date(booking.booking_date), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{booking.time_slot}</span>
              </div>
            </div>
            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
              {booking.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Car className="h-5 w-5 text-primary" />
            <span className="font-medium">
              {booking.vehicle?.year} {booking.vehicle?.make} {booking.vehicle?.model}
            </span>
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t('customerInfo')}</h4>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t('name')}:</span>
                <span>{booking.profile?.full_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t('email')}:</span>
                <span>{booking.profile?.email}</span>
              </div>
              {booking.profile?.phone_number && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('phone')}:</span>
                  <span>{booking.profile?.phone_number}</span>
                </div>
              )}
            </div>
          </div>

          {booking.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{t('notes')}</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {booking.notes}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:justify-between sm:flex-row gap-2 mt-4">
          <div className="flex gap-2">
            {booking.status === 'pending' && (
              <>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={isUpdating}
                >
                  {t('cancelBooking')}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleStatusUpdate('confirmed')}
                  disabled={isUpdating}
                >
                  {t('confirmBooking')}
                </Button>
              </>
            )}
            {booking.status === 'confirmed' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusUpdate('completed')}
                disabled={isUpdating}
              >
                {t('markComplete')}
              </Button>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
