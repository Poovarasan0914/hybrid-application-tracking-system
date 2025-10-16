# Application Tracking System

A comprehensive MERN stack application for managing job applications with automated tracking for technical roles and manual management for non-technical roles.

## 🎯 Problem Statement Solution

This system addresses the challenge of managing applications where:
- **Technical roles** have automated tracking via APIs (Bot Mimic)
- **Non-technical roles** require manual management (Admin)
- **Full traceability** is maintained for all applications

## ✨ Key Features

- **Role-Based Authentication**: JWT-based auth with Applicant, Admin, Bot roles
- **Automated Bot Mimic**: Human-like processing for technical applications
- **Admin Management**: Manual control for non-technical applications  
- **Complete Audit Trail**: Full traceability with timestamps and user attribution
- **Interactive Dashboards**: Real-time charts and metrics for all roles
- **Profile Management**: Mandatory profile completion before applying

## 🛠 Tech Stack

- **Frontend**: React 18, Material-UI, Recharts, Vite
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT tokens with role-based access control
- **Database**: MongoDB with structured schemas
- **Deployment**: Ready for Vercel/Netlify (frontend) and cloud hosting (backend)

## 📁 Project Structure

```
application-tracking-system/
├── backend/
│   ├── config/           # Database and app configuration
│   ├── controllers/      # Business logic handlers
│   ├── middleware/       # Authentication, rate limiting, audit
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Bot automation and mimic services
│   └── server.js        # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   │   ├── admin/   # Admin-specific components
│   │   │   ├── applications/ # Application management
│   │   │   ├── bot/     # Bot dashboard components
│   │   │   ├── common/  # Shared UI components
│   │   │   └── profile/ # User profile components
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Main page components
│   │   ├── services/    # API service layers
│   │   ├── utils/       # Helper functions and constants
│   │   └── theme/       # UI theme configuration
│   └── public/          # Static assets
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd application-tracking-system/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file in backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/ats
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file in frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_APP_NAME=Application Tracking System
   VITE_APP_VERSION=1.0.0
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 👥 User Roles & Access

### 1. Applicant
- **Registration & Profile Management**
- **Job Application Submission** (requires complete profile)
- **Application Status Tracking**
- **Personal Dashboard** with application history

### 2. Bot Mimic
- **Technical Application Processing** with automated workflows
- **Human-like Status Updates** with intelligent comments
- **Scheduled Processing** (every 3 minutes) + manual triggers
- **Workflow Statistics** and processing controls

### 3. Admin
- **Job Creation & Management** (technical/non-technical categories)
- **Non-technical Application Management** (full control)
- **Technical Application Decisions** (accept/reject shortlisted only)
- **User Management** with activation controls
- **Comprehensive Analytics Dashboard**

## 🔄 Application Workflow

### Technical Roles (Bot Mimic Automated)
```
Submit Application → Bot Processing (Applied → Reviewed → Interview → Offer) → Admin Decision (Accept/Reject)
```

### Non-Technical Roles (Admin Manual)
```
Submit Application → Admin Review → Manual Status Updates → Final Decision
```

## 📊 Data Models

### User Schema
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  role: ['applicant', 'admin', 'bot'],
  isActive: Boolean,
  profile: {
    firstName, lastName, phone, address,
    experience, skills[], education, resume,
    isComplete: Boolean
  }
}
```

### Job Schema
```javascript
{
  title: String,
  department: String,
  description: String,
  requirements: [String],
  roleCategory: ['technical', 'non-technical'],
  type: ['full-time', 'part-time', 'contract', 'internship'],
  location: String,
  salary: { min: Number, max: Number, currency: String },
  deadline: Date,
  postedBy: ObjectId (User),
  isActive: Boolean
}
```

### Application Schema
```javascript
{
  jobId: ObjectId (Job),
  applicantId: ObjectId (User),
  coverLetter: String,
  status: ['pending', 'applied', 'reviewed', 'interview', 'offer', 'shortlisted', 'rejected', 'accepted'],
  workflowStage: String,
  notes: [{
    text: String,
    addedBy: ObjectId (User),
    addedAt: Date,
    processedBy: String,
    actionType: String
  }],
  submittedAt: Date,
  lastUpdated: Date
}
```

### Audit Log Schema
```javascript
{
  userId: ObjectId (User),
  action: String (enum of actions),
  description: String,
  details: Mixed,
  resourceType: ['user', 'job', 'application', 'system'],
  resourceId: ObjectId,
  ipAddress: String,
  userAgent: String,
  timestamp: Date
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs/active` - Get active job listings
- `POST /api/admin/jobs` - Create new job (Admin only)

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/admin/applications/non-technical` - Get applications for admin

### Bot Mimic
- `POST /api/bot/mimic/trigger` - Trigger manual processing
- `GET /api/bot/mimic/stats` - Get workflow statistics
- `POST /api/bot/mimic/toggle` - Start/stop bot mimic

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard data
- `PUT /api/admin/applications/:id/status` - Update application status
- `POST /api/admin/applications/:id/notes` - Add note to application

### Audit
- `GET /api/audit` - Get audit logs (Admin only)

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-first approach** with Material-UI breakpoints
- **Adaptive layouts** for all screen sizes
- **Touch-friendly interfaces** for mobile devices

### Interactive Dashboards
- **Real-time charts** using Recharts library
- **Metrics cards** with animated counters
- **Status indicators** with color coding
- **Progress timelines** for application tracking

### User Experience
- **Toast notifications** for user feedback
- **Loading states** with skeleton loaders
- **Error boundaries** for graceful error handling
- **Accessible components** with ARIA labels

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Role-based Access Control** with route protection
- **Input Validation** on both frontend and backend
- **Rate Limiting** to prevent API abuse
- **Audit Logging** for security monitoring

## 📈 Monitoring & Analytics

### Audit System
- **Complete action logging** with timestamps
- **User attribution** for all changes
- **IP address tracking** for security
- **Detailed audit trails** for compliance

### Dashboard Metrics
- **Application statistics** by status and department
- **User activity tracking** with role-based insights
- **Bot processing statistics** with success rates
- **Real-time data updates** for current metrics

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables in hosting dashboard

### Backend (Cloud Services)
1. Deploy to services like Heroku, Railway, or DigitalOcean
2. Configure MongoDB connection string
3. Set environment variables for production
4. Enable CORS for your frontend domain

## 📚 API Documentation

### Swagger UI
Access interactive API documentation at: **http://localhost:5000/api-docs**

### Postman Collection
Import the collection: `Application_Tracking_System.postman_collection.json`

### Key Endpoints
- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Applications**: `/api/applications`, `/api/applications/my-applications`  
- **Admin**: `/api/admin/dashboard`, `/api/admin/jobs`
- **Bot Mimic**: `/api/bot/mimic/trigger`, `/api/bot/mimic/stats`

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Profile completion and validation
- [ ] Job application submission
- [ ] Bot Mimic automated processing
- [ ] Admin manual status updates
- [ ] Role-based access control
- [ ] Audit log generation
- [ ] Dashboard data accuracy

## 🏗️ Architecture

### Frontend (React)
- **Components**: Modular UI components organized by feature
- **Context**: Authentication and theme management
- **Services**: API communication layer
- **Utils**: Helper functions and constants

### Backend (Node.js/Express)
- **Controllers**: Business logic handlers
- **Models**: MongoDB schemas with validation
- **Routes**: API endpoint definitions
- **Services**: Bot automation and workflow processing
- **Middleware**: Authentication, rate limiting, audit logging

### Database (MongoDB)
- **Users**: Authentication and profile data
- **Jobs**: Job postings with role categorization
- **Applications**: Application tracking with status history
- **AuditLogs**: Complete system activity tracking

## 📊 System Workflow

### Technical Applications
```
Submit → Bot Processing (Applied→Reviewed→Interview→Offer) → Admin Decision
```

### Non-Technical Applications
```
Submit → Admin Review → Manual Status Updates → Final Decision
```

---

**Built with ❤️ using the MERN Stack**