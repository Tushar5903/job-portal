# Job Portal Backend

Backend API for a recruitment platform similar to Naukri, with candidate auth, employer job posting, resume upload, search/filter, applications, and admin controls.

## Technology Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT in HTTP-only cookie plus bearer token support
- Password hashing: bcryptjs
- File upload: multer, stored under `public/uploads`
- Optional media service: Cloudinary dependency is available for future remote resume/logo storage

## Database Structure

### users

- `fullName`, `email`, `password`
- `role`: `candidate`, `employer`, `admin`
- `isActive`
- `candidateProfile`: headline, location, phone, skills, experienceYears, education, resumeUrl
- `employerProfile`: designation, phone, company reference

### companies

- `name`, `website`, `logoUrl`, `industry`, `size`, `location`, `description`
- `owner`: employer user reference

### jobs

- `title`, `description`, `requirements`, `skills`, `location`
- `type`: full-time, part-time, contract, internship, freelance
- `workMode`: onsite, remote, hybrid
- `minExperience`, `salaryMin`, `salaryMax`, `openings`, `deadline`
- `status`: draft, active, closed
- `employer`, `company`

### applications

- `candidate`, `job`, `employer`
- `resumeUrl`, `coverLetter`
- `status`: applied, reviewing, shortlisted, rejected, hired

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Use a local MongoDB URI such as `mongodb://127.0.0.1:27017`. The database name is `job_portal`.

## Main API Routes

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Candidate

- `PATCH /api/v1/profile/candidate`
- `POST /api/v1/profile/candidate/resume`
- `POST /api/v1/applications/jobs/:jobId`
- `GET /api/v1/applications/me`

### Employer

- `PUT /api/v1/company/me`
- `GET /api/v1/company/me`
- `POST /api/v1/jobs`
- `GET /api/v1/jobs/employer/me`
- `PATCH /api/v1/jobs/:jobId`
- `PATCH /api/v1/jobs/:jobId/close`
- `GET /api/v1/applications/jobs/:jobId/applicants`
- `PATCH /api/v1/applications/:applicationId/status`

### Public Job Search

- `GET /api/v1/jobs`
- `GET /api/v1/jobs/:jobId`

Supported filters: `q`, `location`, `type`, `workMode`, `skills`, `minSalary`, `maxExperience`, `company`, `page`, `limit`.

Example:

```http
GET /api/v1/jobs?q=react&location=pune&skills=javascript,react&workMode=remote
```

### Admin

- `GET /api/v1/admin/stats`
- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:userId/status`
- `GET /api/v1/admin/jobs`
- `PATCH /api/v1/admin/jobs/:jobId/status`

To create an admin user, register with `role: "admin"` and include `adminSetupKey` matching `ADMIN_SETUP_KEY`.
