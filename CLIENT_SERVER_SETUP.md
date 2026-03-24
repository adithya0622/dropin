# Upgrade - Client-Server Architecture

## Overview

This project uses a modern client-server architecture:

- **Backend**: FastAPI (Python) - Handles ML recommendations, student data, and authentication
- **Frontend**: Next.js (TypeScript/React) - Beautiful UI for students to view marks and recommendations
- **Communication**: REST API over HTTP

```
┌─────────────────┐                      ┌──────────────────┐
│   Next.js App   │                      │   FastAPI Server │
│   (Port 3000)   │◄────────────────────►│   (Port 8000)    │
│                 │      HTTP API        │                  │
│  - Login        │                      │  - Authentication│
│  - Marks View   │                      │  - ML Pipeline   │
│  - Dashboard    │                      │  - Data Access   │
│  - Leaderboard  │                      │  - Spreadsheet   │
└─────────────────┘                      └──────────────────┘
        |                                        |
        |                                        |
        v                                        v
  localStorage                          Students.xlsx
  (tokens)                             Courses.xlsx
```

## Setup Instructions

### 1. Python Backend Setup

#### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

#### Installation

```bash
# Navigate to the root directory
cd e:\drop\Upgrade-main

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Running the Backend

```bash
# Make sure you're in the right directory and venv is activated
python api_backend.py
```

The API will be available at `http://localhost:8000`

#### API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 2. Next.js Frontend Setup

#### Prerequisites
- Node.js 18+ and npm

#### Installation

```bash
# Navigate to upgrade-build directory
cd upgrade-build

# Install dependencies
npm install
```

#### Configuration

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local and set the API URL (if different from localhost)
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Running the Frontend

```bash
# Development mode
npm run dev

# The app will be available at http://localhost:3000
```

## API Endpoints

### Authentication
- **POST** `/api/auth/login`
  - Login with student ID
  - Only first 5 students in spreadsheet allowed
  - Returns: `{ access_token, token_type, student_id, student_name }`

### Student Data
- **POST** `/api/student/marks`
  - Get marks for a specific student
  - Body: `{ student_id, class_id, course_id }`
  - Returns: `{ student_id, class_id, course_id, marks }`

- **GET** `/api/student/profile/{student_id}`
  - Get complete student profile
  - Returns: `{ student_id, name, class_id, course_id, total_marks, recommendation }`

### Recommendations
- **POST** `/api/student/recommendation`
  - Get ML-generated recommendations
  - Body: `{ student_id, class_id, course_id }`
  - Returns: `{ student_id, class_id, course_id, recommendation, total_marks }`

### Leaderboard
- **GET** `/api/students/leaderboard`
  - Get top students leaderboard
  - Query params: `course_id`, `limit`
  - Returns: `{ leaderboard, total, course_id }`

### Courses
- **GET** `/api/courses`
  - Get list of available courses
  - Returns: `{ courses, total }`

### Health
- **GET** `/health`
  - Check if backend is running
  - Returns: `{ status, message }`

## Spreadsheet Requirements

### Students.xlsx
Required columns:
- `Student Id` - Unique identifier
- `Name` - Student name
- `Class` - Class name
- `Mid Term` - Mid-term exam marks
- `End Term` - End-term exam marks
- `Assignment 1` - Assignment 1 marks
- `Assignment 2` - Assignment 2 marks
- `Project` - Project marks
- `Total` - Total marks (calculated)
- `Recommendation` - ML-generated recommendation

**Important**: Only the first 5 students in this spreadsheet can log in.

### Courses.xlsx
Required columns per sheet:
- `Assessments` - Assessment name
- `Total Marks` - Total marks for this assessment
- `Converted Marks` - Converted/normalized marks
- `Strategies` - Recommended learning strategy

## Testing

### Test Credentials
Use any of these Student IDs to test login (first 5 students):
- 22001
- 22002
- 22003
- 22004
- 22005

### Sample API Testing with curl

```bash
# Test health check
curl http://localhost:8000/health

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"student_id": 22001}'

# Get student marks
curl -X POST http://localhost:8000/api/student/marks \
  -H "Content-Type: application/json" \
  -d '{"student_id": 22001, "class_id": "CSE A", "course_id": "Default"}'

# Get recommendations
curl -X POST http://localhost:8000/api/student/recommendation \
  -H "Content-Type: application/json" \
  -d '{"student_id": 22001, "class_id": "CSE A", "course_id": "Default"}'

# Get leaderboard
curl http://localhost:8000/api/students/leaderboard?course_id=Default&limit=10
```

## ML Algorithm

The system uses **ML-KNN (Multi-Label k-Nearest Neighbors)** algorithm to generate personalized recommendations:

1. **Training Phase**: Model learns from historical student data
2. **Prediction Phase**: For each student, predicts relevant learning strategies
3. **Recommendation Generation**: Based on assessment performance thresholds

Performance levels:
- **Outstanding** (≥90% total marks): Continue excellent work
- **Excellent** (85-90%): Minor improvements suggested
- **Good** (75-85%): Focus on weak areas
- **Satisfactory** (70-75%): Dedicated improvement needed
- **Needs Improvement** (<70%): Comprehensive learning strategy

## Project Structure

```
upgrade-main/
├── api_backend.py              # FastAPI backend server
├── mlcode.py                   # ML recommendation logic
├── main.py                     # Original Tkinter app (legacy)
├── requirements.txt            # Python dependencies
│
└── upgrade-build/              # Next.js frontend
    ├── app/
    │   ├── login/page.tsx      # Login page (calls FastAPI)
    │   ├── profile/page.tsx    # Student dashboard
    │   ├── page.tsx            # Home page
    │   └── api/                # Next.js API routes (for reference)
    │
    ├── components/
    │   ├── student-marks-display.tsx      # Marks component
    │   ├── recommendation-display.tsx     # Recommendations component
    │   └── [other components]
    │
    ├── hooks/
    │   ├── use-upgrade-api.ts  # API client hook
    │   └── use-api.ts
    │
    ├── .env.local.example      # Environment template
    ├── package.json
    └── tailwind.config.ts
```

## Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Run with verbose output
python -m uvicorn api_backend.py --reload --host 0.0.0.0 --port 8000
```

### Frontend can't connect to backend
```bash
# Check NEXT_PUBLIC_API_URL in .env.local
# Should match your backend URL

# Verify backend is running
curl http://localhost:8000/health

# Check CORS - backend allows localhost:3000 by default
```

### Login not working
1. Verify Students.xlsx exists in the root directory
2. Check that student ID is in the first 5 rows
3. Student ID should be an integer

### No recommendations showing
1. Verify Courses.xlsx exists
2. Check that course_id matches sheet name in Courses.xlsx
3. ML model needs training data - run mlcode.generate_data() first

## Performance Tips

- **Backend Caching**: Consider caching ML model predictions
- **Frontend**: Use React.memo for components that don't change often
- **Database**: For production, replace Excel files with a proper database
- **Authentication**: Add refresh token mechanism for long sessions

## Security Notes

⚠️ **Important for Production**:
1. Change `SECRET_KEY` in `api_backend.py`
2. Use HTTPS instead of HTTP
3. Implement proper database authentication
4. Add rate limiting to API endpoints
5. Use environment variables for sensitive data

## Future Enhancements

- [ ] Real database (PostgreSQL, MongoDB)
- [ ] Email notifications for recommendations
- [ ] Student progress tracking dashboard
- [ ] Admin panel for teacher/staff
- [ ] Export recommendations as PDF
- [ ] Mobile app
- [ ] Real-time notifications
