# Resume Analyzer Backend API

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the backend directory and add your configuration:
```bash
cp .env.example .env
```

3. Update the `.env` file with your actual values:
- MongoDB connection string
- JWT secret key
- Email configuration (if using email verification)

4. Start the server:

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email
- `GET /api/auth/me` - Get current user (protected)

### Resume
- `POST /api/resume/upload` - Upload and analyze resume (protected)
- `GET /api/resume` - Get all user resumes (protected)
- `GET /api/resume/:id` - Get single resume (protected)
- `DELETE /api/resume/:id` - Delete resume (protected)
- `GET /api/resume/:id/analysis` - Get resume analysis (protected)

### Jobs
- `POST /api/jobs` - Create job posting (recruiter/admin)
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `PUT /api/jobs/:id` - Update job (recruiter/admin)
- `DELETE /api/jobs/:id` - Delete job (recruiter/admin)
- `POST /api/jobs/:id/apply` - Apply to job (protected)
- `GET /api/jobs/matches/:resumeId` - Get matched jobs (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users` - Get all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## Features

### Phase 1 (Implemented)
✅ User authentication with JWT
✅ Email verification system
✅ Resume upload (PDF only)
✅ Text extraction from PDFs
✅ Resume analysis with scoring
✅ ATS score calculation
✅ Skill extraction
✅ Job posting system
✅ Job matching algorithm
✅ Role-based access control

### Phase 2 (Future)
🔜 OpenAI integration for AI suggestions
🔜 Advanced NLP skill extraction
🔜 Admin dashboard analytics
🔜 Recruiter dashboard features
🔜 Email notifications
🔜 Resume templates

## Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # MongoDB models
├── routes/         # API routes
├── utils/          # Utility functions
├── uploads/        # Uploaded resume files
├── .env.example    # Environment variables template
├── server.js       # Entry point
└── package.json    # Dependencies
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload
- **PDF-Parse** - PDF text extraction
- **Nodemailer** - Email sending
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting
- **Morgan** - Request logging

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Input validation
- Rate limiting
- CORS protection
- Helmet security headers
- File type validation
- File size limits

## Testing

Use tools like Postman or Thunder Client to test the API endpoints.

## License

MIT
