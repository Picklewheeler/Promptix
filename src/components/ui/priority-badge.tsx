import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type PriorityType = 'low' | 'medium' | 'high'

interface PriorityBadgeProps {
  priority: PriorityType
  className?: string
}

const priorityConfig = {
  'low': {
    variant: 'secondary' as const,
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20',
    icon: '🟢'
  },
  'medium': {
    variant: 'secondary' as const,
    className: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20',
    icon: '🟡'
  },
  'high': {
    variant: 'secondary' as const,
    className: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
    icon: '🔴'
  }
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const config = priorityConfig[priority]
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(
        'transition-all duration-200 font-medium border capitalize',
        config.className,
        className
      )}
    >
      <span className="mr-1">{config.icon}</span>
      {priority}
    </Badge>
  )
} 