# Blood Donation System - Developer Manual

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Setup Instructions](#setup-instructions)
5. [Database Schema](#database-schema)
6. [Authentication System](#authentication-system)
7. [Frontend Architecture](#frontend-architecture)
8. [Design System](#design-system)
9. [Key Features](#key-features)
10. [API Integration](#api-integration)
11. [Deployment Guide](#deployment-guide)
12. [Troubleshooting](#troubleshooting)

---

## System Overview

The Blood Donation System is a comprehensive web application designed to manage blood donation processes, inventory tracking, and donor-patient interactions. The system serves multiple user roles including administrators, hospitals, donors, and patients.

### Core Functionality
- **Blood Inventory Management**: Real-time tracking of blood supplies by type and quantity
- **Donor Registration**: Complete donor onboarding with medical information
- **Appointment Scheduling**: Calendar-based donation appointment booking
- **Emergency Requests**: Urgent blood request handling system
- **Multi-role Dashboard**: Role-specific interfaces for different user types
- **Reports & Analytics**: Comprehensive reporting for system monitoring

---

## Architecture

### System Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   External      │
│   (React/Vite)  │◄──►│   Backend       │◄──►│   Services      │
│                 │    │                 │    │                 │
│ - Authentication│    │ - Database      │    │ - Email Service │
│ - UI Components │    │ - Auth          │    │ - SMS Service   │
│ - State Mgmt    │    │ - Edge Functions│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture
- **React Components**: Modular, reusable UI components using shadcn/ui
- **Custom Hooks**: `useAuth` for authentication state management
- **Route Protection**: Protected routes for authenticated users
- **State Management**: React Query for server state, React hooks for client state

---

## Technology Stack

### Frontend Technologies
- **React 18.3.1**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development environment
- **Vite**: Fast development build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router DOM**: Client-side routing
- **React Query**: Server state management and caching

### UI Components & Libraries
- **shadcn/ui**: High-quality, accessible component library
- **Radix UI**: Primitive components for complex UI patterns
- **Lucide React**: Modern icon library
- **Recharts**: Data visualization and charting
- **React Hook Form**: Form state management and validation

### Backend & Database
- **Supabase**: Complete backend-as-a-service
  - PostgreSQL database with real-time subscriptions
  - Built-in authentication and authorization
  - Row-level security (RLS) policies
  - Edge functions for serverless computing
  - Auto-generated APIs

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Date-fns**: Date manipulation utilities

---

## Setup Instructions

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Git for version control

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd blood-donation-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   The Supabase configuration is already set up in the project:
   - Project URL: `https://aqzjliletbnulbcamjoe.supabase.co`
   - Anon Key: Pre-configured in `src/integrations/supabase/client.ts`

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Open browser to `http://localhost:5173`
   - The development server includes hot-reload capabilities

### Production Build

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Preview Production Build**
   ```bash
   npm run preview
   ```

---

## Database Schema

### Core Tables

#### `profiles` Table
Stores user profile information and role assignments.

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | integer   | Primary key                    |
| user_id     | uuid      | References auth.users          |
| email       | text      | User email address             |
| role        | text      | User role (admin/hospital/donor/patient) |
| full_name   | text      | User's full name               |
| blood_type  | varchar   | Blood type (A+, B+, etc.)      |
| phone       | text      | Contact phone number           |
| created_at  | timestamp | Record creation time           |

#### `donors` Table
Extended donor information for blood donors.

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | uuid      | Primary key                    |
| name        | text      | Donor full name                |
| blood_group | text      | Blood group                    |
| contact     | text      | Contact information            |
| address     | text      | Physical address               |
| created_at  | timestamp | Registration date              |

#### `blood_inventory` Table
Tracks available blood supply by type.

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | integer   | Primary key                    |
| blood_type  | varchar   | Blood type identifier          |
| quantity    | integer   | Available units                |
| capacity    | integer   | Maximum storage capacity       |
| updated_at  | timestamp | Last update time               |

#### `blood_requests` Table
Manages blood requests from patients/hospitals.

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | integer   | Primary key                    |
| user_id     | uuid      | Requesting user                |
| blood_type  | varchar   | Requested blood type           |
| quantity    | integer   | Required units                 |
| status      | text      | Request status                 |
| created_at  | timestamp | Request submission time        |

#### `appointments` Table
Handles donation appointment scheduling.

| Column           | Type      | Description                    |
|------------------|-----------|--------------------------------|
| id               | uuid      | Primary key                    |
| donor_id         | uuid      | References donors table        |
| appointment_date | date      | Scheduled date                 |
| appointment_time | time      | Scheduled time                 |
| status           | text      | Appointment status             |
| notes            | text      | Additional notes               |
| created_at       | timestamp | Booking time                   |
| updated_at       | timestamp | Last modification              |

#### `emergency_requests` Table
Manages urgent blood requests.

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | uuid      | Primary key                    |
| name        | text      | Patient/requester name         |
| blood_type  | text      | Required blood type            |
| units       | integer   | Number of units needed         |
| location    | text      | Hospital/location              |
| contact     | text      | Emergency contact              |
| urgency     | text      | Urgency level                  |
| notes       | text      | Additional information         |
| created_at  | timestamp | Request time                   |

#### `donations` Table
Records completed blood donations.

| Column        | Type      | Description                    |
|---------------|-----------|--------------------------------|
| id            | integer   | Primary key                    |
| donor_id      | uuid      | Donating user                  |
| blood_type    | varchar   | Donated blood type             |
| units         | integer   | Number of units donated        |
| donation_date | date      | Date of donation               |

#### `alerts` Table
System-wide notifications and alerts.

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | uuid      | Primary key                    |
| severity    | text      | Alert severity level           |
| message     | text      | Alert message content          |
| timestamp   | timestamp | Alert creation time            |

### Row Level Security (RLS)

All tables implement Row Level Security policies to ensure data protection:

- **User Data Isolation**: Users can only access their own records
- **Role-Based Access**: Different permissions based on user roles
- **Admin Override**: Administrative users have broader access rights
- **Public Data**: Some data (like blood inventory) is publicly readable

---

## Authentication System

### Authentication Flow

The system uses Supabase Auth for user management with the following flow:

1. **User Registration**
   - User provides email and password
   - Account created in `auth.users` table
   - Profile created in `profiles` table with default role

2. **User Login**
   - Email/password authentication
   - JWT token issued for session management
   - User profile fetched for role determination

3. **Session Management**
   - Persistent sessions using localStorage
   - Automatic token refresh
   - Real-time auth state changes

### useAuth Hook

The custom `useAuth` hook provides:

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}
```

### Protected Routes

The `ProtectedRoute` component ensures only authenticated users can access protected pages:

```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};
```

### User Roles

The system supports four primary user roles:

- **Admin**: Full system access, user management, reports
- **Hospital**: Blood requests, inventory viewing, emergency requests  
- **Donor**: Appointment scheduling, donation history, profile management
- **Patient**: Blood requests, request tracking, emergency submissions

---

## Frontend Architecture

### Component Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── BloodInventoryTable.tsx
│   ├── Header.tsx
│   ├── ProtectedRoute.tsx
│   ├── QuickActions.tsx
│   ├── RecentActivity.tsx
│   └── StatsCard.tsx
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── pages/               # Page components
│   ├── Index.tsx        # Dashboard
│   ├── Login.tsx
│   ├── DonorRegistration.tsx
│   ├── BloodRequest.tsx
│   ├── ScheduleDonation.tsx
│   └── ...
├── integrations/        # External service integrations
│   └── supabase/
└── lib/                 # Utility functions
    └── utils.ts
```

### Key Components

#### Dashboard Components
- **Header**: Navigation and user information
- **StatsCard**: Metric display with icons and trends
- **QuickActions**: Role-specific action buttons
- **BloodInventoryTable**: Real-time inventory display
- **RecentActivity**: Activity feed component

#### Form Components
- **DonorRegistration**: Multi-step donor onboarding
- **BloodRequest**: Blood request submission form
- **ScheduleDonation**: Calendar-based appointment booking

#### Data Display Components
- **MyRequests**: User's request history
- **EmergencyRequests**: Urgent request management
- **Reports**: Analytics and reporting interface

### State Management

#### Local State
- Component-level state using `useState`
- Form state managed by React Hook Form
- UI state (loading, errors) in individual components

#### Server State
- API calls managed by React Query
- Automatic caching and background updates
- Real-time data synchronization with Supabase

#### Authentication State
- Global auth state via `useAuth` context
- Persistent sessions across browser refreshes
- Real-time auth state updates

---

## Design System

### Color Palette

The system uses a comprehensive HSL-based color system:

#### Primary Colors
- **Primary**: `hsl(207 90% 54%)` - Medical blue
- **Secondary**: `hsl(210 17% 95%)` - Light gray
- **Accent**: `hsl(142 71% 45%)` - Medical green

#### Medical-Specific Colors
- **Emergency**: `hsl(0 84% 60%)` - Critical alerts
- **Warning**: `hsl(43 96% 56%)` - Caution states
- **Success**: `hsl(142 71% 45%)` - Positive outcomes
- **Info**: `hsl(207 90% 54%)` - Informational content

#### Gradients
- **Primary Gradient**: Linear gradient from primary to lighter primary
- **Accent Gradient**: Linear gradient from accent to lighter accent
- **Hero Gradient**: Diagonal gradient from primary to accent

### Typography

The system uses system fonts for optimal performance and accessibility:

- **Font Stack**: System UI fonts (San Francisco, Segoe UI, etc.)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Line Heights**: Optimized for readability (1.4-1.6)

### Component Variants

#### Button Variants
- **Default**: Primary brand styling
- **Secondary**: Subtle secondary styling
- **Outline**: Border-only styling
- **Ghost**: Minimal styling for secondary actions
- **Medical**: Specialized medical context styling

#### Card Variants
- **Default**: Standard card styling
- **Elevated**: Enhanced shadow for emphasis
- **Medical**: Medical-specific styling with appropriate colors

### Responsive Design

The system implements mobile-first responsive design:

- **Breakpoints**: Standard Tailwind breakpoints (sm, md, lg, xl, 2xl)
- **Grid System**: CSS Grid and Flexbox for layouts
- **Mobile Optimization**: Touch-friendly interfaces and proper sizing

### Accessibility

- **Color Contrast**: WCAG AA compliant contrast ratios
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators

---

## Key Features

### 1. Dashboard System

#### Role-Based Dashboards
Each user role receives a customized dashboard experience:

**Admin Dashboard**
- System overview statistics
- User management tools
- Blood inventory monitoring
- Alert management
- Comprehensive reporting access

**Hospital Dashboard**
- Blood request management
- Emergency request submission
- Inventory availability viewing
- Request status tracking
- Patient management tools

**Donor Dashboard**
- Appointment scheduling interface
- Donation history tracking
- Eligibility status monitoring
- Personal profile management
- Reward/recognition system

**Patient Dashboard**
- Blood request submission
- Request status monitoring
- Emergency request capability
- Medical history tracking
- Communication tools

#### Statistical Displays
- Real-time metrics with trend indicators
- Interactive charts using Recharts
- Customizable KPI monitoring
- Historical data visualization
- Export capabilities for reports

### 2. Blood Inventory Management

#### Real-Time Tracking
- Live inventory updates across all user interfaces
- Automatic low-stock alerts and notifications
- Blood type availability with expiration tracking
- Capacity management and optimization
- Integration with donation and request workflows

#### Inventory Features
- Search and filter capabilities
- Bulk inventory operations
- Historical inventory reports
- Predictive analytics for demand forecasting
- Integration with external laboratory systems

### 3. Appointment Scheduling System

#### Calendar Integration
- Interactive calendar interface for appointment booking
- Available time slot management
- Automated reminder systems
- Reschedule and cancellation workflows
- Conflict detection and resolution

#### Scheduling Features
- Multi-location support for donation centers
- Staff availability management
- Capacity planning and optimization
- Waitlist management for high-demand slots
- Integration with donor communication systems

### 4. Emergency Request System

#### Rapid Response
- Priority routing for emergency requests
- Real-time notification systems
- Automated matching with available inventory
- Emergency contact management
- Escalation procedures for critical situations

#### Emergency Features
- GPS-based location services for optimal routing
- Multi-channel communication (SMS, email, push)
- Partnership integration with emergency services
- Real-time status updates for all stakeholders
- Documentation and reporting for emergency responses

### 5. Request Management

#### Comprehensive Tracking
- End-to-end request lifecycle management
- Status updates with detailed timelines
- Communication threading between stakeholders
- Document attachment and sharing capabilities
- Automated workflow triggers and notifications

#### Request Features
- Batch request processing for large orders
- Priority classification and handling
- Approval workflows for different request types
- Integration with inventory allocation systems
- Historical request analysis and reporting

---

## API Integration

### Supabase Client Configuration

The application uses a configured Supabase client for all backend interactions:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

### Database Operations

#### Query Patterns
```typescript
// Basic select with filtering
const { data, error } = await supabase
  .from('blood_requests')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// Insert with error handling
const { data, error } = await supabase
  .from('appointments')
  .insert({
    donor_id: donorId,
    appointment_date: date,
    appointment_time: time,
    status: 'scheduled'
  });

// Update with conditions
const { data, error } = await supabase
  .from('blood_inventory')
  .update({ quantity: newQuantity })
  .eq('blood_type', bloodType);
```

#### Real-Time Subscriptions
```typescript
// Subscribe to inventory changes
const subscription = supabase
  .channel('inventory-changes')
  .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'blood_inventory' },
      (payload) => {
        // Handle real-time updates
      }
  )
  .subscribe();
```

### Authentication API

#### User Management
```typescript
// Sign up new user
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      full_name: fullName,
      role: 'donor'
    }
  }
});

// Sign in existing user
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password
});

// Sign out
await supabase.auth.signOut();
```

### Error Handling

#### Consistent Error Management
```typescript
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

const handleApiCall = async <T>(
  apiCall: () => Promise<{ data: T; error: any }>
): Promise<ApiResponse<T>> => {
  try {
    const { data, error } = await apiCall();
    if (error) throw error;
    return { data, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: error.message || 'An error occurred', 
      loading: false 
    };
  }
};
```

---

## Deployment Guide

### Production Environment Setup

#### Build Configuration
```bash
# Install dependencies
npm install

# Build for production
npm run build

# The build output will be in the 'dist' directory
```

#### Environment Variables
While the current setup uses hardcoded Supabase credentials, for production consider:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment Options

#### 1. Netlify Deployment
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables (if using env vars)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

#### 2. Vercel Deployment
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

#### 3. Custom Server Deployment
```bash
# Build the application
npm run build

# Serve the dist directory with any static file server
# Example with serve:
npx serve -s dist -l 3000
```

### Database Deployment

#### Supabase Production Setup
1. **Create Production Project**: Set up a new Supabase project for production
2. **Run Migrations**: Apply all database migrations to production
3. **Configure RLS**: Ensure all Row Level Security policies are properly configured
4. **Set up Backups**: Configure automated database backups
5. **Monitor Performance**: Set up monitoring and alerting

#### Migration Management
```sql
-- Example migration for adding new features
-- File: supabase/migrations/[timestamp]_add_new_feature.sql

CREATE TABLE IF NOT EXISTS new_feature (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE new_feature ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own records" ON new_feature
  FOR ALL USING (auth.uid() = user_id);
```

### Performance Optimization

#### Frontend Optimizations
- **Code Splitting**: Implement lazy loading for routes
- **Asset Optimization**: Compress images and optimize bundle size
- **CDN Integration**: Use CDN for static asset delivery
- **Caching Strategy**: Implement proper browser caching headers

#### Backend Optimizations
- **Database Indexing**: Add appropriate indexes for frequent queries
- **Query Optimization**: Optimize complex queries and reduce N+1 problems
- **Connection Pooling**: Configure proper database connection pooling
- **Edge Functions**: Use Supabase Edge Functions for compute-heavy operations

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Issues

**Problem**: Users cannot log in or sessions expire unexpectedly
```
Error: Invalid login credentials
```

**Solution**:
```typescript
// Check auth configuration
const { data, error } = await supabase.auth.getSession();
if (error) {
  console.error('Auth error:', error);
  // Redirect to login or refresh session
}

// Ensure proper error handling
const handleLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    // Display user-friendly error message
    toast.error(error.message);
    return;
  }
  
  // Success handling
};
```

#### 2. Database Permission Errors

**Problem**: RLS policies blocking legitimate access
```
Error: new row violates row-level security policy
```

**Solution**:
```sql
-- Check existing policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'your_table';

-- Update policy if needed
DROP POLICY IF EXISTS "existing_policy" ON your_table;
CREATE POLICY "updated_policy" ON your_table
  FOR ALL USING (auth.uid() = user_id);
```

#### 3. Real-Time Subscription Issues

**Problem**: Real-time updates not working
```
Error: Subscription failed to connect
```

**Solution**:
```typescript
// Ensure proper subscription setup
const setupRealtimeSubscription = () => {
  const subscription = supabase
    .channel('custom-channel')
    .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'your_table',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Change received!', payload);
        }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed!');
      }
    });

  // Cleanup on unmount
  return () => {
    subscription.unsubscribe();
  };
};
```

#### 4. Build and Deployment Issues

**Problem**: Build fails with TypeScript errors
```
Error: Type 'X' is not assignable to type 'Y'
```

**Solution**:
```typescript
// Ensure proper type definitions
import type { Database } from '@/integrations/supabase/types';

// Use proper typing for Supabase responses
const { data, error }: { 
  data: Database['public']['Tables']['your_table']['Row'][] | null;
  error: any;
} = await supabase.from('your_table').select('*');

// Handle potential null values
if (data) {
  // Process data safely
}
```

#### 5. Performance Issues

**Problem**: Slow page loads and database queries

**Solutions**:
```typescript
// Implement query optimization
const { data, error } = await supabase
  .from('blood_requests')
  .select(`
    id,
    blood_type,
    quantity,
    status,
    profiles!inner(full_name)
  `)
  .eq('status', 'pending')
  .limit(50);

// Use React Query for caching
const { data, isLoading, error } = useQuery({
  queryKey: ['blood-requests', status],
  queryFn: () => fetchBloodRequests(status),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Implement pagination
const { data, error } = await supabase
  .from('donations')
  .select('*')
  .range(page * pageSize, (page + 1) * pageSize - 1);
```

### Debugging Tools

#### 1. Console Debugging
```typescript
// Enable Supabase debug mode
const supabase = createClient(url, key, {
  auth: { debug: true }
});

// Add comprehensive logging
console.log('Auth state:', await supabase.auth.getUser());
console.log('Session:', await supabase.auth.getSession());
```

#### 2. Network Analysis
- Use browser developer tools to inspect network requests
- Check Supabase dashboard for query logs and performance metrics
- Monitor real-time subscription connections

#### 3. Database Monitoring
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Monitor slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Support and Maintenance

#### Regular Maintenance Tasks
1. **Database Cleanup**: Remove old records and optimize storage
2. **Security Updates**: Keep dependencies and Supabase updated
3. **Performance Monitoring**: Regular performance audits and optimizations
4. **Backup Verification**: Test backup and restore procedures
5. **User Feedback**: Monitor user issues and implement improvements

#### Monitoring Setup
```typescript
// Error tracking
const trackError = (error: Error, context: string) => {
  console.error(`Error in ${context}:`, error);
  // Send to error tracking service
};

// Performance monitoring
const trackPerformance = (operation: string, duration: number) => {
  console.log(`${operation} took ${duration}ms`);
  // Send to analytics service
};
```

---

## Conclusion

This developer manual provides comprehensive documentation for the Blood Donation System. The system is built with modern web technologies and follows best practices for security, performance, and maintainability.

For additional support or questions, refer to:
- Supabase Documentation: https://supabase.com/docs
- React Documentation: https://react.dev
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- shadcn/ui Documentation: https://ui.shadcn.com

### Contributing Guidelines

When contributing to the system:
1. Follow TypeScript strict mode requirements
2. Implement proper error handling for all async operations
3. Add comprehensive tests for new features
4. Follow the established design system patterns
5. Ensure accessibility compliance
6. Document any new APIs or components

### Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added appointment scheduling system
- **v1.2.0**: Enhanced emergency request handling
- **v1.3.0**: Implemented real-time notifications

---

*Last Updated: January 2025*
*Document Version: 1.0*