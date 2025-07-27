import React from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusBadge, StatusType } from '@/components/ui/status-badge'
import { PriorityBadge, PriorityType } from '@/components/ui/priority-badge'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal, Edit, Trash2, DollarSign, Users } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface ProjectData {
  id: string
  title: string
  description?: string
  client: string
  budget: number
  spent: number
  due_date: string
  priority: PriorityType
  status: StatusType
  members?: Array<{
    id: string
    full_name: string
    avatar_url?: string
  }>
  created_by?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  department?: string
}

interface ProjectTableProps {
  projects: ProjectData[]
  onEdit?: (project: ProjectData) => void
  onDelete?: (project: ProjectData) => void
  onStatusChange?: (project: ProjectData, status: StatusType) => void
  isAdmin?: boolean
  loading?: boolean
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onEdit,
  onDelete,
  onStatusChange,
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

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No projects found</div>
        <div className="text-gray-500 text-sm">Projects will appear here when they are created</div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-300 font-semibold">Project</TableHead>
            <TableHead className="text-gray-300 font-semibold">Client</TableHead>
            <TableHead className="text-gray-300 font-semibold">Priority</TableHead>
            <TableHead className="text-gray-300 font-semibold">Status</TableHead>
            <TableHead className="text-gray-300 font-semibold">Budget</TableHead>
            <TableHead className="text-gray-300 font-semibold">Progress</TableHead>
            <TableHead className="text-gray-300 font-semibold">Team</TableHead>
            <TableHead className="text-gray-300 font-semibold">Due Date</TableHead>
            {isAdmin && <TableHead className="text-gray-300 font-semibold w-12"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const budgetProgress = project.budget > 0 ? (project.spent / project.budget) * 100 : 0
            const progressVariant = budgetProgress > 90 ? 'danger' : budgetProgress > 75 ? 'warning' : 'success'
            
            return (
              <TableRow 
                key={project.id} 
                className="border-white/10 hover:bg-white/5 transition-colors duration-200"
              >
                <TableCell>
                  <div>
                    <div className="font-medium text-white mb-1">{project.title}</div>
                    {project.description && (
                      <div className="text-sm text-gray-400 truncate max-w-xs">
                        {project.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-300">{project.client}</div>
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={project.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <DollarSign size={14} className="text-green-400" />
                      <span className="text-sm text-gray-300">
                        {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                      </span>
                    </div>
                    <ProgressBar
                      value={project.spent}
                      max={project.budget}
                      size="sm"
                      variant={progressVariant}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-300">
                    {budgetProgress.toFixed(1)}%
                  </div>
                </TableCell>
                <TableCell>
                  {project.members && project.members.length > 0 ? (
                    <div className="flex items-center space-x-1">
                      <div className="flex -space-x-2">
  {project.members.slice(0, 3).map((member, index) => (
    <Avatar key={member.id} className="h-6 w-6 border-2 border-[#1A1A1A]">
      <AvatarImage src={member.avatar_url || ''} />
      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
        {member.full_name
          .split(' ')
          .filter(n => n.length > 0)
          .map(n => n[0]?.toUpperCase())
          .join('')
          .substring(0, 2) || '??'}
      </AvatarFallback>
    </Avatar>
  ))}
                      </div>
                      {project.members.length > 3 && (
                        <span className="text-xs text-gray-400 ml-2">
                          +{project.members.length - 3} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <Badge className="text-gray-400 border-gray-600">
                      <Users size={12} className="mr-1" />
                      No team
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-300">
                    {format(new Date(project.due_date), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1A1A1A] border-white/10" align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(project)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                          onClick={() => onDelete?.(project)} 
                          className="text-red-400 focus:text-red-300 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
} 