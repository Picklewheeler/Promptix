export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          username: string
          role: 'executive' | 'it_manager' | 'systems_admin' | 'sales' | '3d_modeler' | 'employee'
          department: 'Executive' | 'IT/Infrastructure' | 'Sales' | 'Design & Development'
          rank: string
          avatar_url: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          full_name: string
          username: string
          role?: 'executive' | 'it_manager' | 'systems_admin' | 'sales' | '3d_modeler' | 'employee'
          department: 'Executive' | 'IT/Infrastructure' | 'Sales' | 'Design & Development'
          rank: string
          avatar_url?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          username?: string
          role?: 'executive' | 'it_manager' | 'systems_admin' | 'sales' | '3d_modeler' | 'employee'
          department?: 'Executive' | 'IT/Infrastructure' | 'Sales' | 'Design & Development'
          rank?: string
          avatar_url?: string | null
          is_active?: boolean
        }
      }
      departments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: 'Executive' | 'IT/Infrastructure' | 'Sales' | 'Design & Development'
          description: string | null
          head_id: string | null
          total_budget: number
          spent_budget: number
          fiscal_year: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: 'Executive' | 'IT/Infrastructure' | 'Sales' | 'Design & Development'
          description?: string | null
          head_id?: string | null
          total_budget?: number
          spent_budget?: number
          fiscal_year: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: 'Executive' | 'IT/Infrastructure' | 'Sales' | 'Design & Development'
          description?: string | null
          head_id?: string | null
          total_budget?: number
          spent_budget?: number
          fiscal_year?: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'executive' | 'it_manager' | 'systems_admin' | 'sales' | '3d_modeler' | 'employee'
      department_name: 'Executive' | 'IT/Infrastructure' | 'Sales' | 'Design & Development'
      task_priority: 'high' | 'medium' | 'low'
      task_status: 'Pending' | 'In Progress' | 'Completed'
      project_status: 'Pending' | 'In Progress' | 'Completed'
      transaction_type: 'allocation' | 'expense' | 'adjustment'
    }
  }
}
