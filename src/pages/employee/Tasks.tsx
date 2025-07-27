import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { TaskTable, TaskData } from '@/components/tables/TaskTable'
import { StatusType } from '@/components/ui/status-badge'
import { PriorityType } from '@/components/ui/priority-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Plus, Search, Filter, Calendar as CalendarIcon, CheckSquare, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

interface CreateTaskForm {
  title: string
  description: string
  due_date: Date | undefined
  priority: PriorityType
  assigned_to: string
}

const Tasks = () => {
  const { profile, isAdmin } = useAuth()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<TaskData[]>([])
  const [users, setUsers] = useState<Array<{ id: string; full_name: string; avatar_url?: string }>>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | StatusType>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityType>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createForm, setCreateForm] = useState<CreateTaskForm>({
    title: '',
    description: '',
    due_date: undefined,
    priority: 'medium',
    assigned_to: ''
  })

  // Fetch tasks and users
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (isMounted) {
        await fetchTasks()
        if (isAdmin && isMounted) {
          await fetchUsers()
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [isAdmin, profile])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('tasks')
        .select(`
          *,
          assigned_to:users!tasks_assigned_to_fkey(id, full_name, avatar_url),
          created_by:users!tasks_created_by_fkey(id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })

      // If not admin, only show assigned tasks
      if (!isAdmin && profile) {
        query = query.eq('assigned_to', profile.id)
      }

      const { data, error } = await query

      if (error) throw error

      const transformedTasks: TaskData[] = data?.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        priority: task.priority as PriorityType,
        status: task.status as StatusType,
        assigned_to: task.assigned_to,
        created_by: task.created_by,
        department: task.department_id
      })) || []

      setTasks(transformedTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .eq('is_active', true)
        .order('full_name')

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleCreateTask = async () => {
    if (!createForm.title || !createForm.due_date || !createForm.assigned_to) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: createForm.title,
          description: createForm.description,
          due_date: format(createForm.due_date, 'yyyy-MM-dd'),
          priority: createForm.priority,
          assigned_to: createForm.assigned_to,
  const handleCreateTask = async () => {
    if (!createForm.title || !createForm.due_date || !createForm.assigned_to) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    if (!profile?.id) {
      toast({
        title: 'Error',
        description: 'User profile not loaded',
        variant: 'destructive'
      })
      return
    }

    try {
      // existing task creation logic…          status: 'Pending'
        })
        .select()

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Task created successfully'
      })

      setShowCreateDialog(false)
      setCreateForm({
        title: '',
        description: '',
        due_date: undefined,
        priority: 'medium',
        assigned_to: ''
      })
      fetchTasks()
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive'
      })
    }
  }

  const handleStatusChange = async (task: TaskData, status: StatusType) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', task.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Task status updated'
      })

      fetchTasks()
    } catch (error) {
      console.error('Error updating task status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteTask = async (task: TaskData) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Task deleted successfully'
      })

      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive'
      })
    }
  }

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Task statistics
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-gray-400">
            {isAdmin ? 'Manage and assign tasks across your organization' : 'Track your assigned tasks and progress'}
          </p>
        </div>
        {isAdmin && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#FF5552] to-[#F62623] hover:from-[#FF6B68] hover:to-[#F73734]">
                <Plus size={20} className="mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Create a new task and assign it to a team member
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    placeholder="Enter task title"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Enter task description"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={createForm.priority}
                      onValueChange={(value: PriorityType) => setCreateForm({ ...createForm, priority: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Assign To *</Label>
                    <Select
                      value={createForm.assigned_to}
                      onValueChange={(value) => setCreateForm({ ...createForm, assigned_to: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Due Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {createForm.due_date ? format(createForm.due_date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-white/10" align="start">
                      <Calendar
                        mode="single"
                        selected={createForm.due_date}
                        onSelect={(date) => setCreateForm({ ...createForm, due_date: date })}
                        initialFocus
                        className="text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask} className="bg-gradient-to-r from-[#FF5552] to-[#F62623]">
                    Create Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold">{taskStats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              <span className="text-2xl font-bold">{taskStats.pending}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold">{taskStats.inProgress}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold">{taskStats.completed}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value: 'all' | StatusType) => setStatusFilter(value)}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <Filter size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(value: 'all' | PriorityType) => setPriorityFilter(value)}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <Filter size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task Table */}
      <TaskTable
        tasks={filteredTasks}
        onStatusChange={handleStatusChange}
        onDelete={isAdmin ? handleDeleteTask : undefined}
        isAdmin={isAdmin}
        loading={loading}
      />
    </div>
  )
}

export default Tasks
