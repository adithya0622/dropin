# Quick Start Guide - Client-Server Architecture

## TL;DR - Get It Running in 5 Minutes

### Terminal 1 - Start Python Backend
```bash
cd e:\drop\Upgrade-main

# Setup (first time only)
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Run backend
python api_backend.py
```
✅ Backend running at http://localhost:8000

### Terminal 2 - Start Next.js Frontend
```bash
cd e:\drop\Upgrade-main\upgrade-build

# Setup (first time only)
npm install
cp .env.local.example .env.local

# Run frontend
npm run dev
```
✅ Frontend running at http://localhost:3000

### Browser
1. Go to http://localhost:3000
2. Click "Login"
3. Enter Student ID: **22001** (or any 22001-22005)
4. See your marks and ML recommendations!

---

## What You Get

### Frontend (Next.js)
- ✅ Student Login page
- ✅ Marks display from spreadsheet
- ✅ ML-powered recommendations
- ✅ Leaderboard
- ✅ Student profile

### Backend (FastAPI)
- ✅ Authentication for top 5 students
- ✅ Reads from Students.xlsx
- ✅ Reads from Courses.xlsx
- ✅ Runs ML-KNN algorithm
- ✅ Returns JSON responses

---

## Architecture

```
FRONTEND (Next.js)                 BACKEND (FastAPI)
   Login Page                        /api/auth/login
        ↓                                  ↓
   Dashboard                         Students.xlsx
        ↓                                  ↓
   Show Marks ←──────HTTP API────→ Get Student Data
        ↓                                  ↓
   Show Recommendations              ML-KNN Model
```

---

## Spreadsheet Structure

Your Excel files need these columns:

### Students.xlsx
| Student Id | Name | Class | Mid Term | End Term | Assignment 1 | Assignment 2 | Project | Total |
|---|---|---|---|---|---|---|---|---|
| 22001 | John | CSE A | 45 | 72 | 18 | 19 | 85 | 239 |
| 22002 | Sarah | CSE A | 52 | 78 | 20 | 20 | 92 | 262 |
| 22003 | Mike | CSE A | 48 | 65 | 17 | 18 | 78 | 226 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

⚠️ **Only first 5 students can login**

### Courses.xlsx
| Assessments | Total Marks | Converted Marks | Strategies |
|---|---|---|---|
| Mid Term | 50 | 25 | Study core concepts |
| End Term | 100 | 50 | Practice papers |
| Assignment 1 | 20 | 10 | Submit on time |
| Assignment 2 | 20 | 10 | Quality work |
| Project | 20 | 5 | Collaborate well |

---

## API Communication

### Login (Frontend → Backend)
```
POST /api/auth/login
{
  "student_id": 22001
}

Response:
{
  "access_token": "eyJ0eXAi...",
  "token_type": "bearer",
  "student_id": 22001,
  "student_name": "John"
}
```

### Get Marks (Frontend → Backend)
```
POST /api/student/marks
{
  "student_id": 22001,
  "class_id": "CSE A",
  "course_id": "Default"
}

Response:
{
  "student_id": 22001,
  "class_id": "CSE A",
  "course_id": "Default",
  "marks": {
    "Student Id": 22001,
    "Name": "John",
    "Mid Term": 45,
    "End Term": 72,
    ...
  }
}
```

### Get Recommendations (Frontend → Backend)
```
POST /api/student/recommendation
{
  "student_id": 22001,
  "class_id": "CSE A",
  "course_id": "Default"
}

Response:
{
  "student_id": 22001,
  "recommendation": "Study core concepts; Practice papers",
  "total_marks": 239
}
```

---

## Useful Commands

### Check if backend is running
```bash
curl http://localhost:8000/health
```

### See all API endpoints
Visit: http://localhost:8000/docs

### Check Next.js build
```bash
cd upgrade-build
npm run build
```

### Debug frontend
Open browser → F12 → Console tab

---

## File Locations

```
e:\drop\Upgrade-main\
├── Students.xlsx          ← Your student data (REQUIRED)
├── Courses.xlsx           ← Course config (REQUIRED)
├── api_backend.py         ← Backend server
├── mlcode.py              ← ML algorithm
├── requirements.txt       ← Python packages
├── CLIENT_SERVER_SETUP.md ← Full documentation
│
└── upgrade-build\
    ├── app\login\         ← Frontend login page
    ├── components\        ← React components
    ├── hooks\use-upgrade-api.ts ← API calls
    └── .env.local         ← API URL config
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check Python 3.8+, run `pip install -r requirements.txt` |
| Can't login | Check Students.xlsx exists, student is in first 5 rows |
| No marks showing | Verify spreadsheet columns match exactly |
| CORS error | Check `.env.local` has correct API URL |
| "Port 8000 in use" | Kill process: `lsof -ti:8000 \| xargs kill -9` |

---

## Next Steps

1. ✅ Run both servers
2. ✅ Test login with ID 22001
3. ✅ See marks from spreadsheet
4. ✅ See ML recommendations
5. 📝 Add more students to Students.xlsx (update row numbers if needed for login)

Happy coding! 🚀
