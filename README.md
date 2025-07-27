# Promptix

AI Solutions for Personal and Business Finance - A comprehensive platform that combines AI-powered financial tools with an intuitive management portal for businesses and individuals.

## 🚀 Features

### Public Website
- **Landing Page** with hero section, features showcase, and pricing
- **Feature Highlights** demonstrating AI financial capabilities
- **Pricing Plans** for different user tiers
- **About Us** section with company information
- **Testimonials** and client logos
- **FAQ Section** for common questions
- **Call-to-Action** sections for user engagement

### Employee Portal
- **Dashboard** with comprehensive analytics and insights
- **Task Management** for project tracking and workflow
- **Income Projects** management and monitoring
- **Request System** for internal processes
- **Budget Management** with financial oversight
- **User Management** for team administration
- **Department Organization** (coming soon)
- **Settings** for portal customization (coming soon)

## 🛠 Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives with shadcn/ui
- **Routing**: React Router DOM v7
- **State Management**: TanStack Query (React Query)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: Bun

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Bun** (recommended) or npm/pnpm
- **Supabase Account** for backend services

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/picklewheeler/Promptix
cd Promptix
```

### 2. Install Dependencies
```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install

# Or using pnpm
pnpm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
The project includes Supabase migrations in the `supabase/migrations/` directory. Run the initial schema:

```bash
# If you have Supabase CLI installed
supabase db reset
```

### 5. Start Development Server
```bash
bun dev
```

The application will be available at `http://localhost:5173`

## 🏗 Project Structure

```
Promptix/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (shadcn/ui)
│   │   ├── layouts/      # Layout components
│   │   └── tables/       # Data table components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries and configurations
│   ├── pages/            # Page components
│   │   └── employee/     # Employee portal pages
│   ├── types/            # TypeScript type definitions
│   └── Router.tsx        # Application routing
├── supabase/
│   └── migrations/       # Database migrations
└── ...config files
```

## 🎯 Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun build:dev` - Build in development mode
- `bun lint` - Run ESLint
- `bun preview` - Preview production build

## 🔐 Authentication

The application uses Supabase authentication with:
- Employee login system
- Protected routes for the employee portal
- Context-based auth state management

### Demo Credentials

The system comes with pre-configured demo accounts for testing:

- **CEO**: austin.rich@promptix.com | Password: Promptix123
- **IT Admin**: dylan.wheeler@promptix.com | Password: Promptix123  
- **Sales**: tobias.ives@promptix.com | Password: Promptix123
- **Designer**: izak.grab@promptix.com | Password: Promptix123

Access the employee portal at `/employee/login` and use any of these credentials to explore different user roles and permissions.

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Custom animations** with tailwindcss-animate
- **Dark theme** optimized design
- **Responsive** design for all device sizes
- **Component variants** using class-variance-authority

## 📱 Routes

### Public Routes
- `/` - Landing page
- `/features` - Features showcase
- `/pricing` - Pricing plans
- `/about` - About us

### Employee Portal Routes
- `/employee/login` - Employee authentication
- `/employee/dashboard` - Main dashboard
- `/employee/tasks` - Task management
- `/employee/income-projects` - Project management
- `/employee/requests` - Request system
- `/employee/budget` - Budget management
- `/employee/users` - User management

## 🚀 Deployment

### Build for Production
```bash
bun build
```

### Deploy to Vercel
The project includes a `vercel.json` configuration for easy Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production
Ensure these environment variables are set in your production environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use provided UI components from `components/ui/`
- Maintain responsive design principles
- Keep components small and focused
- Use proper error handling and loading states

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**: Ensure all dependencies are installed with `bun install`
2. **Supabase connection issues**: Verify environment variables are correct
3. **TypeScript errors**: Run `bun build` to check for type issues

### Getting Help

- Check the existing issues in the repository
- Review the component documentation in `src/components/ui/`
- Consult the Supabase documentation for backend issues

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/)
- [Framer Motion](https://www.framer.com/motion/)
