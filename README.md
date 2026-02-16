# 🚀 AI Resume Analyzer & Job Match Platform

A complete, production-ready AI-powered resume analysis and job matching platform built with MERN stack.

## ✨ Features

### Phase 1 (Implemented)
- ✅ User Authentication (Register/Login with JWT)
- ✅ Email Verification System
- ✅ Resume Upload (PDF only)
- ✅ Text Extraction from PDFs
- ✅ AI-Powered Resume Analysis
- ✅ ATS Score Calculation (0-100)
- ✅ Skill Extraction & Categorization
- ✅ Keyword Matching
- ✅ Job Posting System
- ✅ Job Matching Algorithm
- ✅ Role-Based Access Control (User/Recruiter/Admin)
- ✅ Modern, Responsive UI Design
- ✅ Dashboard with Analytics

### Phase 2 (Future Enhancements)
- 🔜 OpenAI Integration for AI Suggestions
- 🔜 Advanced NLP Skill Extraction
- 🔜 Admin Dashboard with Analytics
- 🔜 Advanced Recruiter Features
- 🔜 Email Notifications
- 🔜 Resume Templates

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File upload handling
- **PDF-Parse** - PDF text extraction
- **Nodemailer** - Email sending
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting

### Frontend
- **React.js 18** - UI library
- **React Router DOM** - Navigation
- **Chart.js** & **react-chartjs-2** - Data visualization
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@resumeanalyzer.com
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🚀 Usage

### For Job Seekers
1. Register an account as a "Job Seeker"
2. Upload your resume (PDF format)
3. Get instant AI analysis with:
   - Overall score (0-100)
   - ATS compatibility score
   - Skill extraction
   - Improvement suggestions
4. Browse jobs and get matched based on your resume
5. Apply to jobs directly

### For Recruiters
1. Register an account as a "Recruiter"
2. Post job openings
3. View applicants
4. See candidate match scores
5. Manage job postings

### For Admins
1. Access admin dashboard
2. Manage users
3. View platform analytics
4. Moderate content

## 📁 Project Structure

```
resume-analyzer-platform/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── uploads/         # Uploaded resumes
│   ├── .env.example     # Environment template
│   ├── server.js        # Entry point
│   └── package.json     # Dependencies
│
└── frontend/
    ├── public/          # Static files
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── context/     # React context
    │   ├── services/    # API services
    │   ├── utils/       # Utility functions
    │   ├── App.js       # Main app component
    │   └── index.js     # Entry point
    └── package.json     # Dependencies
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Input validation
- Rate limiting
- CORS protection
- Helmet security headers
- File type & size validation
- SQL injection prevention
- XSS protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email
- `GET /api/auth/me` - Get current user

### Resume
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume` - Get all user resumes
- `GET /api/resume/:id` - Get single resume
- `DELETE /api/resume/:id` - Delete resume
- `GET /api/resume/:id/analysis` - Get analysis

### Jobs
- `POST /api/jobs` - Create job (recruiter)
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `PUT /api/jobs/:id` - Update job (recruiter)
- `DELETE /api/jobs/:id` - Delete job (recruiter)
- `POST /api/jobs/:id/apply` - Apply to job
- `GET /api/jobs/matches/:resumeId` - Get matched jobs

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - Get all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## 🎨 UI Features

- Modern, dark-themed design
- Responsive layout (mobile-first)
- Smooth animations
- Interactive charts
- Real-time notifications
- Loading states
- Error handling
- Empty states

## 🧪 Testing

Use Postman or Thunder Client to test API endpoints.

Example requests are available in the backend README.

## 🚀 Deployment

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Deploy with `npm start`
3. Configure MongoDB Atlas

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy build folder
3. Set REACT_APP_API_URL

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

Built with ❤️ for the developer community

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Happy Coding! 🚀**
