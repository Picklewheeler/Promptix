-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create type user_role as enum ('executive', 'systems_admin', 'it_manager', 'sales', '3d_modeler', 'employee');
create type department_name as enum ('Executive', 'IT/Infrastructure', 'Sales', 'Design & Development');

create table public.users (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    email text unique not null,
    full_name text not null,
    username text unique not null,
    password_hash text not null, -- In production, ensure passwords are properly hashed
    role user_role not null default 'employee',
    department department_name not null,
    rank text not null,
    avatar_url text,
    is_active boolean default true not null
);

-- Create departments table
create table public.departments (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name department_name unique not null,
    description text,
    head_id uuid references public.users(id),
    total_budget numeric(12,2) default 0 not null,
    spent_budget numeric(12,2) default 0 not null,
    fiscal_year integer not null
);

-- Create tasks table
create type task_priority as enum ('high', 'medium', 'low');
create type task_status as enum ('Pending', 'In Progress', 'Completed');

create table public.tasks (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    due_date date not null,
    priority task_priority not null default 'medium',
    status task_status not null default 'Pending',
    assigned_to uuid references public.users(id),
    created_by uuid references public.users(id),
    department_id uuid references public.departments(id)
);

-- Create projects table
create type project_status as enum ('Pending', 'In Progress', 'Completed');

create table public.projects (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    client text not null,
    budget numeric(12,2) not null,
    spent numeric(12,2) default 0 not null,
    due_date date not null,
    status project_status not null default 'Pending',
    priority task_priority not null default 'medium',
    department_id uuid references public.departments(id),
    created_by uuid references public.users(id)
);

-- Create project_members junction table for multiple assignees
create table public.project_members (
    project_id uuid references public.projects(id) on delete cascade,
    user_id uuid references public.users(id) on delete cascade,
    assigned_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (project_id, user_id)
);

-- Create budget_transactions table to track budget changes
create type transaction_type_enum as enum ('allocation', 'expense', 'adjustment');

create table public.budget_transactions (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    department_id uuid references public.departments(id),
    amount numeric(12,2) not null,
    transaction_type transaction_type_enum not null,
    description text,
    created_by uuid references public.users(id),
    project_id uuid references public.projects(id),
    fiscal_year integer not null
);

-- Create RLS policies

-- Users table policies
alter table public.users enable row level security;

create policy "Users can view other users"
    on public.users for select
    using (true);

create policy "Only admins can insert users"
create policy "Only admins can update users"
    on public.users for update
    using (auth.jwt() ->> 'role' in ('executive', 'systems_admin', 'it_manager'))
    with check (auth.jwt() ->> 'role' in ('executive', 'systems_admin', 'it_manager'));
    on public.users for update
    using (auth.jwt() ->> 'role' in ('executive', 'systems_admin', 'it_manager'));

-- Tasks table policies
alter table public.tasks enable row level security;

create policy "Users can view assigned tasks"
    on public.tasks for select
    using (
        auth.uid() = assigned_to or
        auth.jwt() ->> 'role' in ('executive', 'systems_admin', 'it_manager')
    );

create policy "Admins can create tasks"
    on public.tasks for insert
    with check (auth.jwt() ->> 'role' in ('executive', 'systems_admin', 'it_manager'));

create policy "Users can update their tasks status"
    on public.tasks for update
    using (
        auth.uid() = assigned_to or
        auth.jwt() ->> 'role' in ('executive', 'systems_admin', 'it_manager')
    );

-- Projects table policies
alter table public.projects enable row level security;

create policy "Users can view their projects"
    on public.projects for select
    using (
        exists (
            select 1 from project_members
            where project_id = id and user_id = auth.uid()
        ) or
        auth.jwt() ->> 'role' in ('executive', 'systems_admin', 'it_manager')
    );

create policy "Admins can manage projects"
    on public.projects for all
    using (auth.jwt() ->> 'role' in ('executive', 'systems_admin', 'it_manager'));

-- Departments table policies
alter table public.departments enable row level security;

create policy "Users can view departments"
    on public.departments for select
    using (true);

create policy "Only executives can manage departments"
    on public.departments for all
    using (auth.jwt() ->> 'role' = 'executive')
    with check (auth.jwt() ->> 'role' = 'executive');

-- Budget transactions policies
alter table public.budget_transactions enable row level security;

create policy "Users can view budget transactions"
    on public.budget_transactions for select
    using (true);

create policy "Only executives can manage budget"
    on public.budget_transactions for insert
    with check (auth.jwt() ->> 'role' = 'executive');

-- Insert initial data
insert into public.departments (name, description, fiscal_year) values
    ('Executive', 'Executive Leadership Team', 2025),
    ('IT/Infrastructure', 'IT and Infrastructure Management', 2025),
    ('Sales', 'Sales and Business Development', 2025),
    ('Design & Development', 'Product Design and Development', 2025);

-- Insert initial users (passwords should be properly hashed in production)
insert into public.users (email, full_name, username, password_hash, role, department, rank) values
    ('dylan.wheeler@promptix.com', 'Dylan Wheeler', 'Dylan', 'Promptix123', 'systems_admin', 'IT/Infrastructure', 'Systems Administration/Information Technology Manager'),
    ('tobias.ives@promptix.com', 'Tobias Ives', 'TJ', 'Promptix123', 'sales', 'Sales', 'Sales'),
    ('izak.grab@promptix.com', 'Izak Grab', 'Izak', 'Promptix123', '3d_modeler', 'Design & Development', '3D Modeler'),
    ('austin.rich@promptix.com', 'Austin Rich', 'Austin', 'Promptix123', 'executive', 'Executive', 'Chief Executive Officer');

-- Create functions for budget management
create or replace function update_department_budget()
returns trigger as $$
begin
    if TG_OP = 'INSERT' then
        if NEW.transaction_type = 'allocation' then
            update departments
            set total_budget = total_budget + NEW.amount
            where id = NEW.department_id;
        elsif NEW.transaction_type = 'expense' then
            update departments
            set spent_budget = spent_budget + NEW.amount
            where id = NEW.department_id;
        end if;
    end if;
    return NEW;
end;
$$ language plpgsql security definer;

create trigger on_budget_transaction
    after insert on budget_transactions
    for each row
    execute procedure update_department_budget();
