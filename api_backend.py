"""
FastAPI Backend for Upgrade Student Recommendation System
Integrates Python ML code with Next.js frontend
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import joblib
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
import logging

# Import ML functions
import mlcode

# ===== Configuration =====
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(title="Upgrade API", version="1.0.0")

# ===== CORS Configuration =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Logging =====
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ===== Pydantic Models =====
class StudentLogin(BaseModel):
    student_id: int
    
class StudentMarks(BaseModel):
    student_id: int
    class_id: str
    course_id: str
    
class StudentRecommendation(BaseModel):
    student_id: int
    class_id: str
    course_id: str
    
class Token(BaseModel):
    access_token: str
    token_type: str
    student_id: int
    student_name: str
    
class StudentProfile(BaseModel):
    student_id: int
    name: str
    class_id: str
    course_id: str
    total_marks: Optional[float]
    recommendation: Optional[str]

# ===== Authentication Functions =====
def create_access_token(student_id: int, expires_delta: Optional[timedelta] = None):
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode = {"sub": str(student_id), "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        student_id: str = payload.get("sub")
        if student_id is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
        return int(student_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# ===== API Endpoints =====

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "Upgrade API is running"}

@app.post("/api/auth/login", response_model=Token)
async def login(credentials: StudentLogin):
    """
    Login endpoint for students from the top 5 list
    First 5 students in the spreadsheet can login
    """
    try:
        # Load students from Students.xlsx
        excel_file = "Students.xlsx"
        if not os.path.exists(excel_file):
            raise HTTPException(status_code=400, detail="Students spreadsheet not found")
        
        # Get first sheet to check allowed students
        df = pd.read_excel(excel_file, sheet_name=0)
        
        # Limit to first 5 students
        allowed_students = df.head(5)
        
        student_found = allowed_students[allowed_students['Student Id'] == credentials.student_id]
        
        if student_found.empty:
            logger.warning(f"Unauthorized login attempt for student {credentials.student_id}")
            raise HTTPException(status_code=401, detail="Student not authorized to login")
        
        student_name = student_found.iloc[0].get('Name', f'Student {credentials.student_id}')
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            student_id=credentials.student_id,
            expires_delta=access_token_expires
        )
        
        logger.info(f"Student {credentials.student_id} logged in successfully")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "student_id": credentials.student_id,
            "student_name": student_name
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/student/marks")
async def get_student_marks(request: StudentMarks, token: str = None):
    """
    Get student marks from spreadsheet
    """
    try:
        if token:
            verify_token(token)
        
        file_path = "Students.xlsx"
        if not os.path.exists(file_path):
            raise HTTPException(status_code=400, detail="Students spreadsheet not found")
        
        df = pd.read_excel(file_path, sheet_name=request.course_id)
        
        student_data = df[
            (df['Student Id'] == request.student_id) & 
            (df['Class'] == request.class_id)
        ]
        
        if student_data.empty:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Filter out non-numeric columns
        marks = {}
        for col in student_data.columns:
            value = student_data.iloc[0][col]
            if pd.api.types.is_numeric_dtype(student_data[col]):
                marks[col] = float(value) if pd.notna(value) else 0
            elif col in ['Student Id', 'Class', 'Name']:
                marks[col] = value
        
        return {
            "student_id": request.student_id,
            "class_id": request.class_id,
            "course_id": request.course_id,
            "marks": marks
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching marks: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/student/recommendation")
async def get_student_recommendation(request: StudentRecommendation, token: str = None):
    """
    Get ML-based recommendation for a student
    Uses mlcode functions to generate recommendations
    """
    try:
        if token:
            verify_token(token)
        
        file_path = "Students.xlsx"
        if not os.path.exists(file_path):
            raise HTTPException(status_code=400, detail="Students spreadsheet not found")
        
        # Generate data and train model for the course
        mlcode.generate_data(request.course_id)
        mlcode.training_data(request.course_id)
        mlcode.dataprep(request.course_id)
        
        # Get student data
        df = pd.read_excel(file_path, sheet_name=request.course_id)
        
        student_data = df[
            (df['Student Id'] == request.student_id) & 
            (df['Class'] == request.class_id)
        ]
        
        if student_data.empty:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Get recommendation from the ML model
        recommendation = student_data.iloc[0].get('Recommendation', 'No recommendation available')
        total_marks = student_data.iloc[0].get('Total', 0)
        
        return {
            "student_id": request.student_id,
            "class_id": request.class_id,
            "course_id": request.course_id,
            "recommendation": recommendation,
            "total_marks": float(total_marks) if pd.notna(total_marks) else 0
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching recommendation: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/student/profile/{student_id}")
async def get_student_profile(student_id: int, token: str = None):
    """
    Get complete student profile with marks and recommendations
    """
    try:
        if token:
            verify_token(token)
        
        file_path = "Students.xlsx"
        if not os.path.exists(file_path):
            raise HTTPException(status_code=400, detail="Students spreadsheet not found")
        
        # Get first sheet to find student
        df = pd.read_excel(file_path, sheet_name=0)
        student_data = df[df['Student Id'] == student_id]
        
        if student_data.empty:
            raise HTTPException(status_code=404, detail="Student not found")
        
        first_row = student_data.iloc[0]
        
        return {
            "student_id": student_id,
            "name": first_row.get('Name', f'Student {student_id}'),
            "class_id": first_row.get('Class', 'N/A'),
            "course_id": "Default",
            "total_marks": float(first_row.get('Total', 0)) if pd.notna(first_row.get('Total')) else 0,
            "recommendation": first_row.get('Recommendation', 'Generate recommendations')
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/students/leaderboard")
async def get_leaderboard(course_id: str = "Default", limit: int = 10, token: str = None):
    """
    Get leaderboard of students by total marks
    """
    try:
        if token:
            verify_token(token)
        
        file_path = "Students.xlsx"
        if not os.path.exists(file_path):
            # Return empty leaderboard if file doesn't exist
            return {"leaderboard": [], "total": 0}
        
        try:
            df = pd.read_excel(file_path, sheet_name=course_id)
        except:
            # If course sheet doesn't exist, use first sheet
            df = pd.read_excel(file_path, sheet_name=0)
        
        # Sort by Total marks descending and limit results
        if 'Total' in df.columns:
            leaderboard = df.nlargest(limit, 'Total')[
                ['Student Id', 'Name', 'Class', 'Total']
            ].to_dict('records')
        else:
            leaderboard = df.head(limit)[
                ['Student Id', 'Name', 'Class']
            ].to_dict('records')
        
        return {
            "leaderboard": leaderboard,
            "total": len(df),
            "course_id": course_id
        }
    
    except Exception as e:
        logger.error(f"Error fetching leaderboard: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/courses")
async def get_courses():
    """
    Get list of available courses from Courses.xlsx
    """
    try:
        file_path = "Courses.xlsx"
        if not os.path.exists(file_path):
            raise HTTPException(status_code=400, detail="Courses spreadsheet not found")
        
        # Get sheet names as course names
        excel_file = pd.ExcelFile(file_path)
        courses = excel_file.sheet_names
        
        return {
            "courses": courses,
            "total": len(courses)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
