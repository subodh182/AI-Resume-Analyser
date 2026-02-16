# 🚀 Quick Setup Guide

## Prerequisites Checklist
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed or MongoDB Atlas account
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt

## Step-by-Step Setup

### 1️⃣ Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

**Edit `.env` file with your details:**
- MongoDB connection string
- JWT secret (any random string)
- Email credentials (optional for email verification)

```bash
# Start backend server
npm run dev
```

✅ Backend should be running on http://localhost:5000

### 2️⃣ Frontend Setup (3 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

✅ Frontend should open automatically at http://localhost:3000

### 3️⃣ MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Recommended)**
1. Create free account at mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in backend/.env

### 4️⃣ Testing

1. Open http://localhost:3000
2. Click "Get Started" to register
3. Create an account
4. Upload a sample PDF resume
5. View analysis results

## 🎯 Quick Test Credentials

After registration, you can test with these roles:
- **Job Seeker**: Default role for resume analysis
- **Recruiter**: Select during registration to post jobs

## ⚠️ Common Issues

### Backend won't start
- Check if MongoDB is running
- Verify .env file exists
- Check port 5000 isn't in use

### Frontend won't start
- Check if backend is running first
- Verify port 3000 isn't in use
- Clear node_modules and reinstall

### Upload fails
- Ensure uploads folder exists in backend
- Check file is PDF format
- Verify file size < 5MB

## 📚 Next Steps

1. Customize the UI colors in frontend/src/index.css
2. Add your logo to frontend/public
3. Configure email settings for verification
4. Set up MongoDB indexes for better performance
5. Deploy to production

## 🎨 Customization

### Change Primary Color
Edit `frontend/src/index.css`:
```css
:root {
  --primary: #FF3366;  /* Change this */
}
```

### Change App Name
Edit:
- `frontend/public/index.html` (title)
- `frontend/src/components/Navbar.js` (logo)

## 📞 Need Help?

- Check the main README.md
- Review API documentation
- Test with Postman

---

Happy Building! 🎉
