import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface CalendarToolbarProps {
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  view: 'month' | 'day'
  onViewChange: (view: 'month' | 'day') => void
  dateLabel: string
}

export function CalendarToolbar({
  onPrevious,
  onNext,
  onToday,
  view,
  onViewChange,
  dateLabel,
}: CalendarToolbarProps) {
  const t = useTranslations('Admin')

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>
          {t('today')}
        </Button>
        <div className="flex items-center rounded-md border shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-r-none border-r"
            onClick={onPrevious}
            title={t('previous')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={onNext}
            title={t('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold ml-2">{dateLabel}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={view}
          onValueChange={(v) => onViewChange(v as 'month' | 'day')}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={t('selectView')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">{t('monthView')}</SelectItem>
            <SelectItem value="day">{t('dayView')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
