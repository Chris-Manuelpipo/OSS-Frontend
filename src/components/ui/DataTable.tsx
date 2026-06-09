'use client'

import { ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => ReactNode
  className?: string
  sortable?: boolean
  sortKey?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  onRowClick?: (item: T) => void
  rowClassName?: (item: T, index: number) => string | undefined
}

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: 'easeOut' as const },
  }),
}

export default function DataTable<T>({ columns, data, pageSize = 10, onRowClick, rowClassName }: DataTableProps<T>) {
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = String((a as Record<string, unknown>)[sortKey] ?? '')
    const bVal = String((b as Record<string, unknown>)[sortKey] ?? '')
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const start = (page - 1) * pageSize
  const visible = sorted.slice(start, start + pageSize)

  // Compact page list: 1 … (p-1) p (p+1) … last
  const pageItems: (number | 'ellipsis')[] = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const items = new Set<number>([1, totalPages, page, page - 1, page + 1])
    const sortedPages = [...items].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b)
    const result: (number | 'ellipsis')[] = []
    for (let i = 0; i < sortedPages.length; i++) {
      if (i > 0 && sortedPages[i] - sortedPages[i - 1] > 1) result.push('ellipsis')
      result.push(sortedPages[i])
    }
    return result
  })()

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handleSort = (col: Column<T>) => {
    const key = col.sortKey || col.key
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ col }: { col: Column<T> }) => {
    if (!col.sortable && !col.sortKey) return null
    const key = col.sortKey || col.key
    if (sortKey !== key) return <ArrowUpDown size={12} className="ml-1 text-text-anthracite/20" />
    return sortDir === 'asc' ? (
      <ArrowUp size={12} className="ml-1 text-prune-main" />
    ) : (
      <ArrowDown size={12} className="ml-1 text-prune-main" />
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-text-anthracite/10">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-anthracite/60 ${
                    col.className || ''
                  } ${col.sortable || col.sortKey ? 'cursor-pointer select-none hover:text-prune-main transition-colors' : ''}`}
                  onClick={() => (col.sortable || col.sortKey) && handleSort(col)}
                  aria-sort={
                    sortKey === (col.sortKey || col.key)
                      ? sortDir === 'asc' ? 'ascending' : 'descending'
                      : undefined
                  }
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {visible.map((item, idx) => (
                <motion.tr
                  key={idx}
                  custom={idx}
                  variants={rowVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  layout
                  onClick={() => onRowClick?.(item)}
                  onKeyDown={
                    onRowClick
                      ? e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onRowClick(item)
                          }
                        }
                      : undefined
                  }
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? 'button' : undefined}
                  className={`border-b border-text-anthracite/5 hover:bg-prune-main/[0.02] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-prune-main/40 ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${rowClassName?.(item, idx) ?? ''}`}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm text-text-anthracite ${col.className || ''}`}
                    >
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {data.length === 0 && (
          <EmptyState title="Aucune donnée" />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 px-4 pb-1">
          <span className="text-xs text-text-anthracite/60">
            {sorted.length} résultat{sorted.length > 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 text-text-anthracite/60 hover:text-prune-main disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Page précédente"
            >
              <ChevronLeft size={16} />
            </button>
            {pageItems.map((p, i) =>
              p === 'ellipsis' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="min-w-[32px] h-8 flex items-center justify-center text-xs text-text-anthracite/45 select-none"
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[32px] h-8 text-xs transition-colors ${
                    p === page
                      ? 'bg-prune-main text-prune-light'
                      : 'text-text-anthracite/60 hover:text-prune-main'
                  }`}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 text-text-anthracite/60 hover:text-prune-main disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Page suivante"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
