import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'

export function WhatsAppButton() {
  const phoneNumber = '1234567890' // Replace with actual number
  const message = encodeURIComponent('Hi, I am interested in a vehicle on CarSeller.')

  return (
    <Button
      asChild
      className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-lg"
      size="icon"
    >
      <Link href={`https://wa.me/${phoneNumber}?text=${message}`} target="_blank" rel="noopener noreferrer">
        <MessageSquare className="h-8 w-8 text-white" />
        <span className="sr-only">Chat on WhatsApp</span>
      </Link>
    </Button>
  )
}
