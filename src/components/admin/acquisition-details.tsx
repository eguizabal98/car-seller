'use client'

import { useState } from 'react'
import { updateAcquisitionStage } from '@/actions/acquisitions'
import { Acquisition, AcquisitionStage, Expense } from '@/types/acquisitions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, ArrowRight, DollarSign } from 'lucide-react'
import { ExpensesManager } from './expenses-manager'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

import { useTranslations } from 'next-intl'

// ...

interface AcquisitionDetailsProps {
    initialData: Acquisition
}

export function AcquisitionDetails({ initialData }: AcquisitionDetailsProps) {
    const [data, setData] = useState<Acquisition>(initialData)
    const [isUpdating, setIsUpdating] = useState(false)
    const t = useTranslations('Admin.Acquisitions')

    const STAGES: { id: AcquisitionStage; label: string }[] = [
        { id: 'auction', label: t('stages.auction') },
        { id: 'transport', label: t('stages.transport') },
        { id: 'repair', label: t('stages.repair') },
        { id: 'legalization', label: t('stages.legalization') },
        { id: 'completed', label: t('stages.completed') },
    ]

    const currentStageIndex = STAGES.findIndex((s) => s.id === data.stage)

    const handleStageChange = async (newStage: AcquisitionStage) => {
        setIsUpdating(true)
        try {
            await updateAcquisitionStage(data.id, newStage, data.details)
            setData({ ...data, stage: newStage })
            toast.success(`${t('movedTo')} ${t(`stages.${newStage}`)}`)
        } catch (error) {
            toast.error(t('failedUpdateStage'))
        } finally {
            setIsUpdating(false)
        }
    }

    const nextStage = STAGES[currentStageIndex + 1]

    const totalCost = data.expenses?.reduce((sum: number, exp: Expense) => sum + Number(exp.amount), 0) || 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {data.vehicle.year} {data.vehicle.make} {data.vehicle.model}
                    </h1>
                    <p className="text-muted-foreground">VIN: {data.vehicle.vin || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Card className="px-4 py-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div className="text-sm font-medium text-muted-foreground uppercase">{t('totalCost')}</div>
                        <div className="text-lg font-bold">${totalCost.toLocaleString()}</div>
                    </Card>
                    <Badge variant={data.stage === 'completed' ? 'default' : 'secondary'} className="text-base px-4 py-1 capitalize">
                        {t(`stages.${data.stage as 'auction' | 'transport' | 'repair' | 'legalization' | 'completed'}`)}
                    </Badge>
                </div>
            </div>

            {/* Stepper */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative flex items-center justify-between w-full">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10" />
                        {STAGES.map((stage, index) => {
                            const isCompleted = index <= currentStageIndex
                            const isCurrent = index === currentStageIndex
                            return (
                                <div key={stage.id} className="flex flex-col items-center gap-2 bg-background px-2">
                                    <div
                                        className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all",
                                            isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted-foreground text-muted-foreground",
                                            isCurrent && "ring-4 ring-primary/20"
                                        )}
                                    >
                                        {index + 1}
                                    </div>
                                    <span className={cn("text-xs font-medium", isCurrent ? "text-primary" : "text-muted-foreground")}>
                                        {stage.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Actions Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('currentStage')}: {STAGES[currentStageIndex]?.label || data.stage}</CardTitle>
                            <CardDescription>
                                {t('manageActions')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Stage Specific Content could go here (e.g., forms for Auction details) */}
                            <div className="p-4 border rounded-md bg-muted/20 mb-4">
                                <p className="text-sm text-muted-foreground">
                                    {t('currentStatusIs')} <strong>{t(`stages.${data.stage as 'auction' | 'transport' | 'repair' | 'legalization' | 'completed'}`)}</strong>.
                                    {nextStage ? ` ${t('whenReadyProceed')} ${nextStage.label}.` : ` ${t('finalize')}`}
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                {nextStage && (
                                    <Button onClick={() => handleStageChange(nextStage.id)} disabled={isUpdating}>
                                        {t('proceedTo')} {nextStage.label}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Expenses Manager */}
                    <ExpensesManager acquisitionId={data.id} initialExpenses={data.expenses || []} />
                </div>

                {/* Sidebar / Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('vehicleDetails')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">{t('make') || 'Make'}</span>
                                <span className="font-medium">{data.vehicle.make}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">{t('model') || 'Model'}</span>
                                <span className="font-medium">{data.vehicle.model}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">{t('year') || 'Year'}</span>
                                <span className="font-medium">{data.vehicle.year}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">{t('color') || 'Color'}</span>
                                <span className="font-medium">{data.vehicle.color || '-'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">{t('status') || 'Status'}</span>
                                <span className="font-medium capitalize">{data.vehicle.status}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
