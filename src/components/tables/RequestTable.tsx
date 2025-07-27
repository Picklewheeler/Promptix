import React from 'react'
import { format, isValid } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MoreHorizontal, Check, X, Clock, AlertTriangle, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type RequestStatus = 'pending' | 'approved' | 'rejected'
export type RequestUrgency = 'low' | 'medium' | 'high' | 'urgent'

export interface RequestData {
  id: string
  title: string
  quantity: number
  justification: string
  urgency: RequestUrgency
  status: RequestStatus
  requested_by: {
    id: string
    full_name: string
    avatar_url?: string
  }
  reviewed_by?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  created_at: string
  reviewed_at?: string
}

interface RequestTableProps {
  requests: RequestData[]
  onApprove?: (request: RequestData) => void
  onReject?: (request: RequestData) => void
  onView?: (request: RequestData) => void
  isAdmin?: boolean
  loading?: boolean
}

const urgencyConfig = {
  low: {
    variant: 'secondary' as const,
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    icon: '🟢'
  },
  medium: {
    variant: 'secondary' as const,
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: '🟡'
  },
  high: {
    variant: 'secondary' as const,
    className: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    icon: '🟠'
  },
  urgent: {
    variant: 'secondary' as const,
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: '🔴'
  }
}

const statusConfig = {
  pending: {
    variant: 'secondary' as const,
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    icon: <Clock size={12} />
  },
  approved: {
    variant: 'secondary' as const,
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: <Check size={12} />
  },
  rejected: {
    variant: 'secondary' as const,
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: <X size={12} />
  }
}

export const RequestTable: React.FC<RequestTableProps> = ({
  requests,
  onApprove,
  onReject,
  onView,
  isAdmin = false,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No requests found</div>
        <div className="text-gray-500 text-sm">Requests will appear here when they are submitted</div>
      </div>
    )
  }

  // Helper function to safely get initials
  const getInitials = (fullName: string | undefined | null): string => {
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      return '?'
    }
    return fullName.trim().split(' ').map(n => n[0]).join('').toUpperCase()
  }

  // Helper function to safely format dates
  const formatDate = (dateString: string | undefined | null, formatStr: string): string => {
    if (!dateString) return 'Invalid date'
    const date = new Date(dateString)
    return isValid(date) ? format(date, formatStr) : 'Invalid date'
  }

  return (
    <TooltipProvider>
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-gray-300 font-semibold">Item Request</TableHead>
              <TableHead className="text-gray-300 font-semibold">Quantity</TableHead>
              <TableHead className="text-gray-300 font-semibold">Urgency</TableHead>
              <TableHead className="text-gray-300 font-semibold">Status</TableHead>
              <TableHead className="text-gray-300 font-semibold">Requested By</TableHead>
              <TableHead className="text-gray-300 font-semibold">Date</TableHead>
              {isAdmin && <TableHead className="text-gray-300 font-semibold">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => {
              const urgencyStyle = urgencyConfig[request.urgency]
              const statusStyle = statusConfig[request.status]
              
              return (
                <TableRow 
                  key={request.id} 
                  className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-white mb-1">{request.title}</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-sm text-gray-400 truncate max-w-xs cursor-help">
                            {request.justification}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-md">
                          <p>{request.justification}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-300 font-medium">
                      {request.quantity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`transition-all duration-200 font-medium border capitalize ${urgencyStyle.className}`}
                    >
                      <span className="mr-1">{urgencyStyle.icon}</span>
                      {request.urgency}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`transition-all duration-200 font-medium border capitalize ${statusStyle.className}`}
                    >
                      <span className="mr-1">{statusStyle.icon}</span>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={request.requested_by?.avatar_url || ''} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                          {getInitials(request.requested_by?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-300">
                        {request.requested_by?.full_name || 'Unknown User'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-300">
                      {formatDate(request.created_at, 'MMM dd, yyyy')}
                    </div>
                    {request.reviewed_at && (
                      <div className="text-xs text-gray-500">
                        Reviewed {formatDate(request.reviewed_at, 'MMM dd')}
                      </div>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {request.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-green-400 border-green-400/20 hover:bg-green-400/10"
                              onClick={() => onApprove?.(request)}
                            >
                              <Check size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-red-400 border-red-400/20 hover:bg-red-400/10"
                              onClick={() => onReject?.(request)}
                            >
                              <X size={14} />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-gray-400 border-gray-400/20 hover:bg-gray-400/10"
                            onClick={() => onView?.(request)}
                          >
                            <Eye size={14} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
} 