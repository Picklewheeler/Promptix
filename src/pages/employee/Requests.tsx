import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { RequestTable, RequestData, RequestStatus, RequestUrgency } from '@/components/tables/RequestTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Search, Filter, Package, Clock, Check, X, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CreateRequestForm {
  title: string
  quantity: number
  justification: string
  urgency: RequestUrgency
}

const Requests = () => {
  const { profile, isAdmin } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState<RequestData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all')
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | RequestUrgency>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createForm, setCreateForm] = useState<CreateRequestForm>({
    title: '',
    quantity: 1,
    justification: '',
    urgency: 'medium'
  })

  // Fetch requests
  useEffect(() => {
    fetchRequests()
  }, [isAdmin])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('item_requests')
        .select(`
          *,
          requested_by:users!item_requests_requested_by_fkey(id, full_name, avatar_url),
          reviewed_by:users!item_requests_reviewed_by_fkey(id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })

      // If not admin, only show own requests
      if (!isAdmin && profile) {
        query = query.eq('requested_by', profile.id)
      }

      const { data, error } = await query

      if (error) throw error

      const transformedRequests: RequestData[] = data?.map(request => ({
        id: request.id,
        title: request.title,
        quantity: request.quantity,
        justification: request.justification,
        urgency: request.urgency as RequestUrgency,
        status: request.status as RequestStatus,
        requested_by: request.requested_by,
        reviewed_by: request.reviewed_by,
        created_at: request.created_at,
        reviewed_at: request.reviewed_at
      })) || []

      setRequests(transformedRequests)
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch requests',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRequest = async () => {
    if (!createForm.title || !createForm.justification || createForm.quantity <= 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('item_requests')
        .insert({
          title: createForm.title,
          quantity: createForm.quantity,
          justification: createForm.justification,
          urgency: createForm.urgency,
          requested_by: profile?.id,
          status: 'pending'
        })
        .select()

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Request submitted successfully'
      })

      setShowCreateDialog(false)
      setCreateForm({
        title: '',
        quantity: 1,
        justification: '',
        urgency: 'medium'
      })
      fetchRequests()
    } catch (error) {
      console.error('Error creating request:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit request',
        variant: 'destructive'
      })
    }
  }

  const handleApproveRequest = async (request: RequestData) => {
    try {
      const { error } = await supabase
        .from('item_requests')
        .update({ 
          status: 'approved',
          reviewed_by: profile?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', request.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Request approved successfully'
      })

      fetchRequests()
    } catch (error) {
      console.error('Error approving request:', error)
      toast({
        title: 'Error',
        description: 'Failed to approve request',
        variant: 'destructive'
      })
    }
  }

  const handleRejectRequest = async (request: RequestData) => {
    try {
      const { error } = await supabase
        .from('item_requests')
        .update({ 
          status: 'rejected',
          reviewed_by: profile?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', request.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Request rejected'
      })

      fetchRequests()
    } catch (error) {
      console.error('Error rejecting request:', error)
      toast({
        title: 'Error',
        description: 'Failed to reject request',
        variant: 'destructive'
      })
    }
  }

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.justification.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter
    
    return matchesSearch && matchesStatus && matchesUrgency
  })

  // Request statistics
  const requestStats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Department Requests</h1>
          <p className="text-gray-400">
            {isAdmin ? 'Review and manage item requests from team members' : 'Submit requests for items needed for your work'}
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#FF5552] to-[#F62623] hover:from-[#FF6B68] hover:to-[#F73734]">
              <Plus size={20} className="mr-2" />
              Submit Request
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Submit Item Request</DialogTitle>
              <DialogDescription>
                Request items or resources needed for your work
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Item/Resource *</Label>
                <Input
                  id="title"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Enter item name or description"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={createForm.quantity}
                  onChange={(e) => setCreateForm({ ...createForm, quantity: parseInt(e.target.value) || 1 })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="justification">Justification *</Label>
                <Textarea
                  id="justification"
                  value={createForm.justification}
                  onChange={(e) => setCreateForm({ ...createForm, justification: e.target.value })}
                  placeholder="Explain why this item is needed..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label>Urgency</Label>
                <Select
                  value={createForm.urgency}
                  onValueChange={(value: RequestUrgency) => setCreateForm({ ...createForm, urgency: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10">
                    <SelectItem value="low">Low - Can wait</SelectItem>
                    <SelectItem value="medium">Medium - Standard</SelectItem>
                    <SelectItem value="high">High - Important</SelectItem>
                    <SelectItem value="urgent">Urgent - Needed ASAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRequest} className="bg-gradient-to-r from-[#FF5552] to-[#F62623]">
                  Submit Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Request Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold">{requestStats.total}</span>
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
              <span className="text-2xl font-bold">{requestStats.pending}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold">{requestStats.approved}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <X className="h-5 w-5 text-red-400" />
              <span className="text-2xl font-bold">{requestStats.rejected}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value: 'all' | RequestStatus) => setStatusFilter(value)}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <Filter size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={urgencyFilter} onValueChange={(value: 'all' | RequestUrgency) => setUrgencyFilter(value)}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <Filter size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">All Urgency</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Request Table */}
      <RequestTable
        requests={filteredRequests}
        onApprove={isAdmin ? handleApproveRequest : undefined}
        onReject={isAdmin ? handleRejectRequest : undefined}
        isAdmin={isAdmin}
        loading={loading}
      />
    </div>
  )
}

export default Requests 