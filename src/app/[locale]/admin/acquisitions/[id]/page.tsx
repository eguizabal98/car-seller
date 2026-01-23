import { getAcquisition } from '@/actions/acquisitions'
import { AcquisitionDetails } from '@/components/admin/acquisition-details'
import { notFound } from 'next/navigation'

export default async function AcquisitionDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const acquisition = await getAcquisition(params.id)

    if (!acquisition) {
        notFound()
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <AcquisitionDetails initialData={acquisition} />
        </div>
    )
}
