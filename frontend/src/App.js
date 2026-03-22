import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import ResumeAnalysis from './pages/ResumeAnalysis';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// New Feature Pages
import JobMatch from './pages/JobMatch';
import ResumeSummaryGenerator from './pages/ResumeSummaryGenerator';
import ResumeRanking from './pages/ResumeRanking';
import InterviewQuestions from './pages/InterviewQuestions';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            
            {/* Protected Routes - Core Features */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/upload-resume" element={
              <PrivateRoute>
                <UploadResume />
              </PrivateRoute>
            } />
            
            <Route path="/resume/:id" element={
              <PrivateRoute>
                <ResumeAnalysis />
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            {/* Protected Routes - New AI Features */}
            <Route path="/job-match" element={
              <PrivateRoute>
                <JobMatch />
              </PrivateRoute>
            } />
            
            <Route path="/resume-summary" element={
              <PrivateRoute>
                <ResumeSummaryGenerator />
              </PrivateRoute>
            } />
            
            <Route path="/resume-ranking" element={
              <PrivateRoute>
                <ResumeRanking />
              </PrivateRoute>
            } />
            
            <Route path="/interview-questions" element={
              <PrivateRoute>
                <InterviewQuestions />
              </PrivateRoute>
            } />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

---

## 🎯 **What's New:**

### **New Routes Added:**

1. ✅ **Job Match** - `/job-match`
   - Match resume with job descriptions
   - Show match percentage
   - Missing skills analysis

2. ✅ **Resume Summary Generator** - `/resume-summary`
   - AI-powered summary generation
   - Multiple tone options
   - Regenerate functionality

3. ✅ **Resume Ranking** - `/resume-ranking`
   - Compare multiple resumes
   - Side-by-side comparison
   - Score breakdown

4. ✅ **Interview Questions** - `/interview-questions`
   - AI-generated questions
   - Skill-based filtering
   - Difficulty levels

---

## 🗺️ **Complete Route Structure:**
```
Public Routes:
  /                    → Home
  /login               → Login
  /register            → Register
  /jobs                → Jobs Listing
  /jobs/:id            → Job Details

Protected Routes (Core):
  /dashboard           → User Dashboard
  /upload-resume       → Upload Resume
  /resume/:id          → Resume Analysis
  /profile             → User Profile

Protected Routes (AI Features):
  /job-match           → Job Match Tool
  /resume-summary      → Summary Generator
  /resume-ranking      → Resume Ranker
  /interview-questions → Interview Prep

Fallback:
  *                    → 404 Not Found
