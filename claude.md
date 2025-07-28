# StepIn Frontend - Claude.md

## Project Overview
StepIn is a comprehensive job matching platform frontend built with React and TypeScript. The platform serves both job seekers and companies, providing features for job posting, application management, real-time messaging, and AI-powered job matching.

## Tech Stack & Architecture

### Core Technologies
- **React 18.3.1** - UI Framework
- **TypeScript 5.7.2** - Type safety and development experience
- **Vite 6.2.0** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Styling framework
- **React Router DOM 6.30.1** - Client-side routing

### Key Libraries & Dependencies
- **Radix UI** - Comprehensive UI component library (30+ components)
- **Framer Motion 12.6.3** - Animations and transitions
- **React Hook Form 7.55.0** - Form management with validation
- **Axios 1.9.0** - HTTP client for API communication
- **Socket.io-client 4.8.1** - Real-time messaging
- **Stripe 18.2.1** - Payment processing
- **Recharts 2.15.1** - Data visualization
- **Zod 3.24.2** - Schema validation
- **JWT Decode 4.0.0** - JWT token handling
- **Sonner 2.0.3** - Toast notifications

### Build & Development Tools
- **ESLint 9.21.0** - Code linting with TypeScript rules
- **PostCSS & Autoprefixer** - CSS processing
- **Tailwind CSS Animate** - Animation utilities

## Project Structure

```
src/
├── Pages/                    # Page components organized by feature
│   ├── Auth/                # Authentication pages (login, register, reset)
│   ├── Company/             # Company-specific pages
│   │   ├── Dashboard/       # Company dashboard
│   │   ├── JobPost/         # Job posting and management
│   │   └── ProfilePage/     # Company profile
│   ├── Dashboard/           # Job seeker dashboard
│   ├── Landing/             # Landing page components
│   ├── Onboarding/          # User onboarding flow
│   ├── Profile/             # Job seeker profile management
│   └── Messages/            # Messaging interface
├── components/              # Reusable UI components
│   ├── Layout/              # Layout components (Navbar, Footer)
│   ├── Modals/              # Modal dialogs
│   ├── Others/              # Utility components
│   ├── forms/               # Form components
│   ├── notifications/       # Notification components
│   └── ui/                  # ShadCN UI components (30+ components)
├── services/                # API service layer
├── Contexts/                # React Context providers
├── hooks/                   # Custom React hooks
├── utils/                   # Utility functions and constants
├── assets/                  # Static assets
└── lib/                     # Library configurations
```

## API Architecture

### Backend Configuration
- **Production API**: `https://api.stepincompany.com`
- **Staging API**: `https://staging.stepincompany.com`
- **Local Development**: `http://localhost:8080`
- **WebSocket**: Real-time messaging on port 3000

### Service Layer
The application uses a comprehensive service layer pattern with dedicated services for:

- **authServices.tsx** - Authentication and user management
- **jobServices.tsx** - Job posting, searching, and matching
- **jobSeekerServices.tsx** - Job seeker profile and preferences
- **companyServices.tsx** - Company profile and management
- **applicationServices.tsx** - Job application lifecycle
- **chatServices.tsx** - Real-time messaging between users and companies
- **notificationService.tsx** - Push notifications and alerts
- **userServices.tsx** - General user operations
- **educationServices.tsx** - Education history management
- **workExperienceServices.tsx** - Work experience tracking
- **certificationServices.tsx** - Professional certifications
- **projectServices.tsx** - Portfolio project management
- **questionServices.tsx** - AI matching questionnaire system

### Authentication
- JWT-based authentication with localStorage token storage
- Google OAuth integration with callback handling
- Email verification with OTP system
- Password reset functionality
- Automatic token refresh and 401 error handling

## Key Features & User Types

### Job Seekers
- **Onboarding Flow**: Multi-step profile creation with AI questionnaire
- **Interactive Job Matching**: AI-powered job recommendations
- **Profile Management**: Comprehensive profile with skills, experience, education
- **Application Tracking**: View and manage job applications
- **Real-time Messaging**: Chat with potential employers
- **Resume Management**: Upload and manage resume documents

### Companies
- **Job Posting**: Create and manage job listings
- **Applicant Management**: Review applications and candidate profiles
- **Company Profile**: Build comprehensive company presence
- **Messaging System**: Communicate with potential candidates
- **Payment Integration**: Stripe-based billing for premium features

## State Management

### Context Providers
- **ThemeContext**: Currently locked to dark mode only
- **ProfileContext**: Job seeker profile state management with automatic fetching and error handling

### Local Storage Usage
- JWT access tokens
- User preferences and theme settings
- Form data persistence during onboarding

## UI/UX Architecture

### Design System
- **ShadCN UI Components**: 30+ pre-built, accessible components
- **Tailwind CSS**: Utility-first styling with custom color palette
- **Custom Theme**: Extended color system including job card specific colors
- **Responsive Design**: Mobile-first approach with container breakpoints
- **Dark Mode**: Currently enforced across the entire application

### Animation & Interactions
- **Framer Motion**: Page transitions and component animations
- **Tailwind Animate**: Micro-interactions and hover states
- **Carousel Components**: Embla Carousel for testimonials and job listings
- **Interactive Elements**: Custom components for job matching and filtering

## Development Workflow

### Available Scripts
```bash
npm run dev        # Start development server (Vite)
npm run build      # Production build (TypeScript + Vite)
npm run lint       # ESLint code quality checks
npm run preview    # Preview production build
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: React and TypeScript specific rules
- **Path Aliases**: `@/*` maps to `src/*` for cleaner imports

## Deployment & Environment

### Vercel Configuration
- Configured for SPA routing with proper rewrites
- Environment-specific API endpoints
- Optimized for static asset delivery

### Environment Variables
The application uses different base URLs based on environment:
- Production: `api.stepincompany.com`
- Staging: `staging.stepincompany.com`
- Development: `localhost:8080`

## Real-time Features

### Socket.io Integration
- Real-time messaging between job seekers and companies
- Notification system for new messages and application updates
- Connection management with automatic reconnection

### File Upload
- Resume upload and management
- Profile picture uploads
- File sharing in chat conversations

## Security Considerations

### Authentication Security
- JWT token validation
- Automatic logout on token expiration
- Secure API endpoint communication
- Input sanitization for user data

### Data Protection
- Form validation with Zod schemas
- XSS protection through React's built-in sanitization
- HTTPS-only communication in production

## Performance Optimizations

### Code Splitting
- Route-based code splitting with React Router
- Dynamic imports for heavy components
- Optimized bundle sizes with Vite

### Asset Optimization
- Image optimization and lazy loading
- CSS purging with Tailwind CSS
- Tree-shaking for unused code elimination

## Testing & Development

### Development Tools
- Hot Module Replacement (HMR) with Vite
- React Fast Refresh for instant updates
- TypeScript error reporting in development
- ESLint integration with IDE support

## Component Architecture

### Reusable Components
- Extensive UI component library with ShadCN
- Custom form components with validation
- Modal system for dialogs and confirmations
- Notification system with Sonner toasts

### Page Structure
- Shell components for consistent layout
- Protected routes for authenticated areas
- Dynamic routing for job posts and applications
- Error boundaries for graceful error handling

## Future Considerations

### Scalability
- Modular service architecture allows for easy API changes
- Component-based structure supports feature additions
- Context system can be extended for additional state management

### Maintenance
- Well-documented codebase with TypeScript interfaces
- Consistent naming conventions and file organization
- Separation of concerns between UI, logic, and data layers

---

*This documentation provides comprehensive information about the StepIn frontend codebase for Claude to understand the project structure, dependencies, and development patterns.*