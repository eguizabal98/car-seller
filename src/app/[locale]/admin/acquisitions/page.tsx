import { getAcquisitions } from '@/actions/acquisitions'
import { AcquisitionsList } from '@/components/admin/acquisitions-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'

export default async function AcquisitionsPage() {
    const acquisitions = await getAcquisitions()
    const t = await getTranslations('Admin')

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('acquisitions')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <AcquisitionsList initialAcquisitions={acquisitions} />
                </CardContent>
            </Card>
        </div>
    )
}
