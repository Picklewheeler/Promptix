import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ProjectTable, ProjectData } from '@/components/tables/ProjectTable'
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
import { Plus, Search, Filter, Calendar as CalendarIcon, Briefcase, DollarSign, Users, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

interface CreateProjectForm {
  title: string
  description: string
  client: string
  budget: string
  due_date: Date | undefined
  priority: PriorityType
}

const Projects = () => {
  const { profile, isAdmin } = useAuth()
  const { toast } = useToast()
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [users, setUsers] = useState<Array<{ id: string; full_name: string; avatar_url?: string }>>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | StatusType>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityType>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createForm, setCreateForm] = useState<CreateProjectForm>({
    title: '',
    description: '',
    client: '',
    budget: '',
    due_date: undefined,
    priority: 'medium'
  })

  // Fetch projects and users
  useEffect(() => {
    fetchProjects()
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin, profile])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('projects')
        .select(`
          *,
          created_by:users!projects_created_by_fkey(id, full_name, avatar_url),
          project_members(user_id, users(id, full_name, avatar_url))
        `)
        .order('created_at', { ascending: false })

      // If not admin, only show projects where user is a member
      if (!isAdmin && profile) {
        query = query.eq('project_members.user_id', profile.id)
      }

      const { data, error } = await query

      if (error) throw error

      const transformedProjects: ProjectData[] = data?.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        client: project.client,
        budget: project.budget,
        spent: project.spent,
        due_date: project.due_date,
        priority: project.priority as PriorityType,
        status: project.status as StatusType,
        members: project.project_members?.map((pm: any) => pm.users) || [],
        created_by: project.created_by,
        department: project.department_id
      })) || []

      setProjects(transformedProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
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

  const handleCreateProject = async () => {
    if (!createForm.title || !createForm.client || !createForm.budget || !createForm.due_date) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      const budgetNumber = parseFloat(createForm.budget)
      if (isNaN(budgetNumber) || budgetNumber <= 0) {
        toast({
          title: 'Error',
          description: 'Please enter a valid budget amount',
          variant: 'destructive'
        })
        return
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: createForm.title,
          description: createForm.description,
          client: createForm.client,
          budget: budgetNumber,
          spent: 0,
          due_date: format(createForm.due_date, 'yyyy-MM-dd'),
          priority: createForm.priority,
          created_by: profile?.id,
          status: 'Pending'
        })
        .select()
        .single()

      if (error) throw error

      // Add creator as a project member
      if (data && profile) {
        const { error: memberError } = await supabase
          .from('project_members')
          .insert({
            project_id: data.id,
            user_id: profile.id
          })

        if (memberError) {
          console.error('Error adding project member:', memberError)
          toast({
            title: 'Warning',
            description: 'Project created but you may not have access. Please contact an administrator.',
            variant: 'destructive'
          })
        }
      }
      toast({
        title: 'Success',
        description: 'Project created successfully'
      })

      setShowCreateDialog(false)
      setCreateForm({
        title: '',
        description: '',
        client: '',
        budget: '',
        due_date: undefined,
        priority: 'medium'
      })
      fetchProjects()
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive'
      })
    }
  }

  const handleStatusChange = async (project: ProjectData, status: StatusType) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', project.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Project status updated'
      })

      fetchProjects()
    } catch (error) {
      console.error('Error updating project status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update project status',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteProject = async (project: ProjectData) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Project deleted successfully'
      })

      fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive'
      })
    }
  }

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Project statistics
  const projectStats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'Pending').length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">
            {isAdmin ? 'Manage projects, budgets, and track progress across your organization' : 'View your assigned projects and track progress'}
          </p>
        </div>
        {isAdmin && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#FF5552] to-[#F62623] hover:from-[#FF6B68] hover:to-[#F73734]">
                <Plus size={20} className="mr-2" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Create a new project with budget and timeline tracking
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={createForm.title}
                      onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                      placeholder="Enter project title"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client">Client *</Label>
                    <Input
                      id="client"
                      value={createForm.client}
                      onChange={(e) => setCreateForm({ ...createForm, client: e.target.value })}
                      placeholder="Enter client name"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Enter project description"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget (USD) *</Label>
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      step="0.01"
                      value={createForm.budget}
                      onChange={(e) => setCreateForm({ ...createForm, budget: e.target.value })}
                      placeholder="0.00"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
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
                  <Button onClick={handleCreateProject} className="bg-gradient-to-r from-[#FF5552] to-[#F62623]">
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold">{projectStats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-400" />
              <span className="text-2xl font-bold">{projectStats.inProgress}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold">{formatCurrency(projectStats.totalBudget)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-red-400" />
              <span className="text-2xl font-bold">{formatCurrency(projectStats.totalSpent)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search projects..."
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

      {/* Project Table */}
      <ProjectTable
        projects={filteredProjects}
        onStatusChange={handleStatusChange}
        onDelete={isAdmin ? handleDeleteProject : undefined}
        isAdmin={isAdmin}
        loading={loading}
      />
    </div>
  )
}

export default Projects
