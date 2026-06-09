'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  href?: string
  className?: string
}

export default function StatCard({ title, value, subtitle, icon, href, className = '' }: StatCardProps) {
  const inner = (
    <motion.div
      whileHover={href ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-white-pure border border-text-anthracite/5 p-6 ${
        href ? 'cursor-pointer hover:border-prune-sec/20 hover:shadow-sm transition-all' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-text-anthracite/60">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold text-prune-main">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-text-anthracite/60 truncate">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-prune-sec/60 flex-shrink-0">{icon}</div>
        )}
      </div>
    </motion.div>
  )

  if (href) {
    return <Link href={href}>{inner}</Link>
  }

  return inner
}
