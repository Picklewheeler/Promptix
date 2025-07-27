# Promptix Employee Portal – Development Plan

## 1. Feature Breakdown

| Module | Key UI Elements | Visible To |
| --- | --- | --- |
| **Tasks** | • New Task Box (create/edit/remove tasks)<br/>• Assigned/My Tasks list (update progress) | Execs & IT (full), Employees (list + progress) |
| **Projects** | • Project Management Box (create/edit/remove projects)<br/>• Project Tracking list (update progress) | Execs & IT (full), Employees (tracking) |
| **Department Requests** | • Submit Item Request form<br/>• All Requests table (approve/reject) | Employees (submit), Execs & IT (manage) |
| **Departments** | • Add Employee form<br/>• Department Mgmt<br/>• Rank Mgmt<br/>• Employee DB | Execs & IT |
| **Site Editing** | • Company-Info editor with toolbar + save | Execs & IT |
| **Settings** | • Account settings fields<br/>• Password & 2FA section<br/>• Theme toggle | All employees |

## 2. Roles & Permissions

1. **Executive** – full access to all admin features.
2. **Systems Admin / IT Manager** – same as Executive minus org-level billing.
3. **Employee** – limited to self-service & assigned work.

Implementation: Enhanced Supabase Row-Level Security (RLS) using PostgreSQL's built-in `auth.role()` and JWT claims for secure role verification.

**Security Architecture:**
- Use JWT claims (`auth.jwt() ->> 'role'`) in RLS policies instead of mutable database columns
- Separate `user_roles` table with restricted update permissions (service role only)
- PostgreSQL SECURITY LABEL to prevent non-service accounts from modifying role data
- Defense-in-depth with multiple verification layers to prevent privilege escalation

## 3. Data Model (Supabase)

- `profiles(id, first_name, last_name, email, phone, username, role, theme, two_fa_enabled, …)`
- `tasks(id, title, descr, due_date, priority, assignee_id, status, created_by)`
- `projects(id, title, descr, due_date, priority, status, owner_id)`
- `task_logs(id, task_id, status, note, updated_at, updated_by)`
- `item_requests(id, title, quantity, justification, urgency, requested_by, status, reviewed_by)`
- `departments(id, name, description)`
- `employees(id, profile_id, department_id, rank_id)`
- `ranks(id, name, description, weight)`
- `site_content(id, key, value, updated_at, updated_by)`

All tables have soft-delete `archived_at` where relevant.

## 4. Frontend Work

- [ ] Global auth/role guard & RLS integration
- [ ] Layouts
  - [ ] EmployeePortalLayout (already exists)
  - [ ] Admin sidebar variations
- [ ] Pages
  - [ ] `/tasks` – New Task (admin) + Assigned Tasks list
  - [ ] `/projects` – Project Mgmt (admin) + Tracking list
  - [ ] `/requests` – Submit Request (employee) + All Requests (admin)
  - [ ] `/departments` – Add Employee, Dept & Rank Mgmt, DB
  - [ ] `/site` – Company-Info editor
  - [ ] `/settings` – account, auth, appearance
- [ ] Reusable components
  - [ ] `TaskTable`, `ProjectTable`, `RequestTable`
  - [ ] `ProgressBadge`, `PriorityBadge`
  - [ ] `ThemeToggle`, `SaveBar`

## 5. Backend / API Work

- [ ] Supabase schema migration set (see §3)
- [ ] RLS policies per table & role
- [ ] Edge Functions (if complex logic is needed e.g. email notifications)

## 6. Milestones & Timeline

1. **MVP-Admin Workflows** (Weeks 1-2)
   - Schema, RLS
   - Tasks & Projects admin pages
2. **Employee Interactions** (Week 3)
   - Assigned lists, progress updates, item request submission
3. **Department Management** (Week 4)
   - Departments, ranks, employee DB
4. **Site Editor & Settings** (Week 5)
   - Company-Info editor, account settings, theme/2FA
5. **Polish & QA** (Week 6)
   - Access audits, UX tweaks, docs

## 7. Definition of Done

- All pages accessible per role matrix
- 100% type-safe API calls
- Lighthouse scores ≥90
- Zero ESLint/TS errors
- CI passes & deploy preview green

---
_This plan derives directly from `TODO.md` and will be updated as scope evolves._ 