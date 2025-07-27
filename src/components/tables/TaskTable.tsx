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
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal, Edit, Trash2, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface TaskData {
  id: string
  title: string
  description?: string
  due_date: string
  priority: PriorityType
  status: StatusType
  assigned_to?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  created_by?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  department?: string
}

interface TaskTableProps {
  tasks: TaskData[]
  onEdit?: (task: TaskData) => void
  onDelete?: (task: TaskData) => void
  onStatusChange?: (task: TaskData, status: StatusType) => void
  isAdmin?: boolean
  loading?: boolean
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
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

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No tasks found</div>
        <div className="text-gray-500 text-sm">Tasks will appear here when they are created</div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-300 font-semibold">Task</TableHead>
            <TableHead className="text-gray-300 font-semibold">Priority</TableHead>
            <TableHead className="text-gray-300 font-semibold">Status</TableHead>
            <TableHead className="text-gray-300 font-semibold">Assigned To</TableHead>
            <TableHead className="text-gray-300 font-semibold">Due Date</TableHead>
            <TableHead className="text-gray-300 font-semibold">Department</TableHead>
            {isAdmin && <TableHead className="text-gray-300 font-semibold w-12"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task.id} 
              className="border-white/10 hover:bg-white/5 transition-colors duration-200"
            >
              <TableCell>
                <div>
                  <div className="font-medium text-white mb-1">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-gray-400 truncate max-w-xs">
                      {task.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <PriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                {task.assigned_to ? (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assigned_to.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                        {task.assigned_to.full_name
                          .split(' ')
                          .filter(n => n.length > 0)
                          .map(n => n[0])
                          .join('')}                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-300">{task.assigned_to.full_name}</span>
                  </div>
                ) : (
                  <Badge className="text-gray-400 border-gray-600">
                    <User size={12} className="mr-1" />
                    Unassigned
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-300">
                  {format(new Date(task.due_date), 'MMM dd, yyyy')}
                </div>
              </TableCell>
              <TableCell>
                {task.department && (
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    {task.department}
                  </Badge>
                )}
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
                      <DropdownMenuItem onClick={() => onEdit?.(task)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem 
                        onClick={() => onDelete?.(task)} 
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 