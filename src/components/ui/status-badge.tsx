import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusType = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig = {
  'Pending': {
    variant: 'secondary' as const,
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20',
    icon: '⏳'
  },
  'In Progress': {
    variant: 'secondary' as const,
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
    icon: '🔄'
  },
  'Completed': {
    variant: 'secondary' as const,
    className: 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20',
    icon: '✅'
  },
  'Cancelled': {
    variant: 'secondary' as const,
    className: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
    icon: '❌'
  }
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status]
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(
        'transition-all duration-200 font-medium border',
        config.className,
        className
      )}
    >
      <span className="mr-1">{config.icon}</span>
      {status}
    </Badge>
  )
} 