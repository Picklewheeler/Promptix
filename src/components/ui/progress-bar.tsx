import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  label?: string
}

const sizeConfig = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
}

const variantConfig = {
  default: 'from-blue-500 to-blue-600',
  success: 'from-green-500 to-green-600',
  warning: 'from-orange-500 to-orange-600',
  danger: 'from-red-500 to-red-600'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">
            {label || 'Progress'}
          </span>
          <span className="text-sm text-gray-400">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={cn(
        'w-full bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm',
        sizeConfig[size]
      )}>
        <div
          className={cn(
            'h-full bg-gradient-to-r transition-all duration-500 ease-out rounded-full',
            variantConfig[variant]
          )}
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  )
} 