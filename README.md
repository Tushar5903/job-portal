# Job Portal

A full-stack job portal application built with Node.js/Express backend and React frontend, featuring user authentication, job posting, applications, admin management, and an AI-powered chatbot.

## Features

### User Management
- **Registration & Login**: Support for candidates, employers, and admins with role-based access.
- **Profiles**: Candidates can manage their profiles with skills, experience, and education. Employers can create and manage company profiles.
- **Authentication**: JWT-based authentication with secure cookies.

### Job Management
- **Job Posting**: Employers can create, update, and delete job listings with details like title, description, requirements, skills, location, salary, etc.
- **Job Search & Filtering**: Candidates can search and filter jobs by keywords, location, type, work mode, skills, salary, and experience.
- **Job Details**: Detailed view of job postings with application options.

### Applications
- **Apply for Jobs**: Candidates can apply to jobs with resume uploads.
- **Application Management**: Employers can view and manage applications for their jobs. Admins can oversee all applications.

### Admin Panel
- **User Management**: Admins can view, edit, and delete users.
- **Job Oversight**: Admins can manage all job postings and applications.
- **System Monitoring**: Access to overall statistics and system health.

### AI Interaction
- **Chatbot**: Integrated AI chatbot powered by Groq API (Llama 3.1 model) to assist users with queries related to job search, applications, profiles, and general portal usage.

## Tech Stack

### Backend
- **Node.js** with **Express.js** for server-side logic.
- **MongoDB** with **Mongoose** for database management.
- **JWT** for authentication.
- **Cloudinary** for file uploads (resumes, company logos).
- **Multer** for handling multipart/form-data.
- **Nodemailer** and **Mailgen** for email services.
- **Axios** for external API calls (Groq for AI).

### Frontend
- **React** with **Vite** for fast development and building.
- **React Router** for client-side routing.
- **React Typed** for typing animations.
- **CSS** for styling.

## Architecture & Flow

### Overall Flow
1. **User Registration/Login**: Users register as candidates, employers, or admins. Authentication via JWT.
2. **Role-Based Access**: Different dashboards for candidates, employers, and admins.
3. **Job Lifecycle**:
   - Employers create company profiles and post jobs.
   - Candidates search, view, and apply to jobs.
   - Employers review applications.
   - Admins monitor and manage everything.
4. **AI Assistance**: Chatbot available on all pages for user queries.

### Backend Structure
- **Controllers**: Handle business logic for auth, jobs, applications, profiles, companies, admin, and chatbot.
- **Models**: MongoDB schemas for User, Job, Application, Company.
- **Routes**: RESTful API endpoints under `/api/v1/`.
- **Middlewares**: Authentication, error handling, file uploads.
- **Utils**: Helper functions for API responses, error handling, async operations, Cloudinary integration.

### Frontend Structure
- **Components**: NavBar, Chatbot, ProtectedRoute for role-based routing.
- **Pages**: Home, Login, Register, Profile, Candidate Dashboard, Employer Dashboard, Admin Dashboard, Job Details, Not Found.
- **Contexts**: AuthContext for managing user state.
- **API**: Axios-based API calls to backend.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user.
- `POST /api/v1/auth/login` - Login user.
- `POST /api/v1/auth/logout` - Logout user.
- `GET /api/v1/auth/me` - Get current user info.

### Profile
- `GET /api/v1/profile` - Get user profile.
- `PUT /api/v1/profile` - Update user profile.
- `POST /api/v1/profile/avatar` - Upload profile avatar.

### Company
- `POST /api/v1/company` - Create company profile.
- `GET /api/v1/company` - Get company profile.
- `PUT /api/v1/company` - Update company profile.
- `POST /api/v1/company/logo` - Upload company logo.

### Jobs
- `POST /api/v1/jobs` - Create a job (employers).
- `GET /api/v1/jobs` - Get jobs with filters (candidates).
- `GET /api/v1/jobs/:id` - Get job details.
- `PUT /api/v1/jobs/:id` - Update job (employers).
- `DELETE /api/v1/jobs/:id` - Delete job (employers).
- `GET /api/v1/jobs/employer` - Get jobs by employer.

### Applications
- `POST /api/v1/applications` - Apply for a job (candidates).
- `GET /api/v1/applications` - Get user's applications (candidates).
- `GET /api/v1/applications/job/:jobId` - Get applications for a job (employers).
- `PUT /api/v1/applications/:id` - Update application status (employers).

### Admin
- `GET /api/v1/admin/users` - Get all users.
- `PUT /api/v1/admin/users/:id` - Update user.
- `DELETE /api/v1/admin/users/:id` - Delete user.
- `GET /api/v1/admin/jobs` - Get all jobs.
- `GET /api/v1/admin/applications` - Get all applications.
- `GET /api/v1/admin/stats` - Get system statistics.

### Chatbot
- `POST /api/v1/chatbot/message` - Send message to AI chatbot.

## AI Interaction

The chatbot is integrated into the frontend and uses the Groq API with the Llama 3.1-8B model. It provides assistance on:
- Job search tips.
- Application process guidance.
- Profile update advice.
- Employer posting help.
- Admin actions explanation.
- General portal navigation.

The AI is prompted to keep responses brief, helpful, and focused on the portal's scope.

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to `backend/` directory.
2. Install dependencies: `npm install`
3. Create `.env` file with required variables (e.g., MONGO_URI, JWT_SECRET, CLOUDINARY credentials, GROQ_API_KEY, etc.).
4. Run development server: `npm run dev`

### Frontend Setup
1. Navigate to `Frontend/job_portal/` directory.
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Backend port
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials
- `GROQ_API_KEY`: API key for Groq AI
- `ADMIN_SETUP_KEY`: Key for admin registration
- `CORS_ORIGIN`: Allowed origins for CORS

## Usage

1. Start the backend server.
2. Start the frontend server.
3. Access the application at `http://localhost:5173` (default Vite port).
4. Register as a candidate, employer, or admin.
5. Explore features based on your role.

