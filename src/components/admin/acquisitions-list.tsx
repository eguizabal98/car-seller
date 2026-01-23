'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { CreateAcquisitionDialog } from './create-acquisition-dialog'
import { Acquisition } from '@/types/acquisitions'
import { useTranslations } from 'next-intl'

export function AcquisitionsList({ initialAcquisitions }: { initialAcquisitions: Acquisition[] }) {
    const [acquisitions] = useState<Acquisition[]>(initialAcquisitions)
    const t = useTranslations('Admin.Acquisitions')
    const tCommon = useTranslations('Common')

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <CreateAcquisitionDialog />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{tCommon('vehicle') || 'Vehicle'}</TableHead>
                        <TableHead>{t('stage')}</TableHead>
                        <TableHead>{t('date')}</TableHead>
                        <TableHead>{t('status')}</TableHead>
                        <TableHead className="text-right">{t('actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {acquisitions.map((acquisition) => (
                        <TableRow key={acquisition.id}>
                            <TableCell className="font-medium">
                                {acquisition.vehicle.year} {acquisition.vehicle.make} {acquisition.vehicle.model}
                                <div className="text-sm text-muted-foreground">{acquisition.vehicle.vin}</div>
                            </TableCell>
                            <TableCell>
                                <div className="capitalize">{t(`stages.${acquisition.stage as 'auction' | 'transport' | 'repair' | 'legalization' | 'completed'}`)}</div>
                            </TableCell>
                            <TableCell>{format(new Date(acquisition.created_at), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{acquisition.vehicle.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={`/admin/acquisitions/${acquisition.id}`}>{t('viewDetails')}</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {acquisitions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                {t('noAcqFound')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
