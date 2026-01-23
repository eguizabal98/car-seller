'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { createAcquisition } from '@/actions/acquisitions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const formSchema = z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
    vin: z.string().optional(),
    color: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CreateAcquisitionDialog() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const t = useTranslations('Admin.Acquisitions')
    const tCommon = useTranslations('Common')

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            make: '',
            model: '',
            year: new Date().getFullYear(),
            vin: '',
            color: '',
        },
    })


    async function onSubmit(values: FormValues) {
        setIsSubmitting(true)
        try {
            // We set default values for other required vehicle fields not in this initial form
            const vehicleData = {
                ...values,
                price: 0, // Placeholder
                mileage: 0, // Placeholder
                fuel_type: 'petrol', // Default
                transmission: 'automatic', // Default
                body_type: 'Sedan', // Default
            }

            await createAcquisition(vehicleData)
            toast.success(t('startedSuccess'))
            setOpen(false)
            form.reset()
            router.refresh()
        } catch (error) {
            toast.error(t('failedCreate'))
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('startNew')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('newAcqTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('newAcqDesc')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="make"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('make') || 'Make'}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="BMW" {...field} />
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
                                    <FormLabel>{t('model') || 'Model'}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="X5" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('year') || 'Year'}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(parseInt(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('color') || 'Color'}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Black" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="vin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>VIN</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Optional" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? tCommon('creating') || 'Creating...' : t('create')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
