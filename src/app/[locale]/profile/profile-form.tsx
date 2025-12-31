'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateProfile } from './actions'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ProfileFormProps {
  user: {
    full_name: string | null
    phone_number: string | null
    avatar_url: string | null
    email: string | undefined
  }
}

const initialState = {
  error: '',
  success: '',
}

export function ProfileForm({ user }: ProfileFormProps) {
  const t = useTranslations('Profile')
  const [state, formAction, isPending] = useActionState(updateProfile as any, initialState)

  useEffect(() => {
    if (state.success) {
        toast.success(state.success)
    } else if (state.error) {
        toast.error(state.error)
    }
  }, [state])

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url || ''} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{t('settings')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input 
              id="email" 
              value={user.email} 
              disabled 
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              {t('emailDescription')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">{t('fullName')}</Label>
            <Input 
              id="fullName" 
              name="fullName" 
              defaultValue={user.full_name || ''} 
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
            <Input 
              id="phoneNumber" 
              name="phoneNumber" 
              defaultValue={user.phone_number || ''} 
              placeholder="+1 234 567 890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">{t('profilePicture')}</Label>
            <Input 
              id="avatar" 
              name="avatar" 
              type="file"
              accept="image/*"
            />
            <p className="text-sm text-muted-foreground">
              {t('profilePictureDescription')}
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('saveChanges')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
