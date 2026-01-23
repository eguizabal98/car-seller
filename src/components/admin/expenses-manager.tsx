'use client'

import { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { addExpense, deleteExpense } from '@/actions/acquisitions'
import { Expense, ExpenseCategory } from '@/types/acquisitions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const formSchema = z.object({
    category: z.enum(['purchase_price', 'auction_fee', 'transport_fee', 'repair_cost', 'legalization_fee', 'parts', 'labor', 'other']),
    amount: z.number().min(0.01, 'Amount must be positive'),
    description: z.string().optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
})

type FormValues = z.infer<typeof formSchema>

export function ExpensesManager({ acquisitionId, initialExpenses }: { acquisitionId: string; initialExpenses: Expense[] }) {
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses || [])
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const t = useTranslations('Admin.Acquisitions')

    const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
        { value: 'purchase_price', label: t('expenseCategories.purchase_price') },
        { value: 'auction_fee', label: t('expenseCategories.auction_fee') },
        { value: 'transport_fee', label: t('expenseCategories.transport_fee') },
        { value: 'repair_cost', label: t('expenseCategories.repair_cost') },
        { value: 'legalization_fee', label: t('expenseCategories.legalization_fee') },
        { value: 'parts', label: t('expenseCategories.parts') },
        { value: 'labor', label: t('expenseCategories.labor') },
        { value: 'other', label: t('expenseCategories.other') },
    ]

    useEffect(() => {
        setExpenses(initialExpenses || [])
    }, [initialExpenses])

    const handleDelete = async (id: string) => {
        try {
            await deleteExpense(id, acquisitionId)
            setExpenses(expenses.filter(e => e.id !== id))
            toast.success(t('expenseDeleted'))
            router.refresh()
        } catch (e) {
            toast.error(t('failedDeleteExpense'))
        }
    }

    // Form handling
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: 'other',
            amount: 0,
            description: '',
            date: new Date().toISOString().split('T')[0],
        },
    })

    async function onSubmit(values: FormValues) {
        try {
            await addExpense(acquisitionId, values as { category: ExpenseCategory; amount: number; description?: string; date: string })
            toast.success(t('expenseAdded'))
            setOpen(false)
            form.reset()
            router.refresh()
        } catch (e) {
            toast.error(t('failedAddExpense'))
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('expenses')}</CardTitle>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            {t('addExpense')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('addExpense')}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('category')}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {EXPENSE_CATEGORIES.map((cat) => (
                                                        <SelectItem key={cat.value} value={cat.value}>
                                                            {cat.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('amount')} ($)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    {...field}
                                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('date')}</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('description')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Optional details..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">{t('addExpense')}</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('category')}</TableHead>
                            <TableHead>{t('description')}</TableHead>
                            <TableHead>{t('date')}</TableHead>
                            <TableHead className="text-right">{t('amount')}</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="capitalize">{t(`expenseCategories.${expense.category}`)}</TableCell>
                                <TableCell>{expense.description || '-'}</TableCell>
                                <TableCell>{format(new Date(expense.date), 'MMM dd, yyyy')}</TableCell>
                                <TableCell className="text-right font-medium">
                                    ${Number(expense.amount).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)} className="h-8 w-8 text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {expenses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground h-20">
                                    {t('noExpenses')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
