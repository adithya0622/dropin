"""
mlcode_inference.py - Inference-only version for Flask API
Only loads pre-trained models (.joblib files) - NO RETRAINING
To be used by the Flask API on Vercel
"""

import pandas as pd
import numpy as np
import joblib
import os
from typing import Dict, Any

# Configuration
COURSE_EXCEL_FILENAME = "Courses.xlsx"
STUDENTS_EXCEL_FILENAME = "Students.xlsx"

def get_student_recommendation_data(student_id: int, class_id: str, course_id: str) -> Dict[str, Any]:
    """
    Get student marks and recommendations using pre-trained models (inference only).
    
    This function:
    1. Loads the pre-trained ML model from .joblib file
    2. Gets student data from Students.xlsx
    3. Generates recommendations based on the model
    4. Returns all data as a dictionary
    
    No retraining occurs - all models must be pre-trained and saved.
    
    Args:
        student_id: Student ID to get recommendations for
        class_id: Class ID (e.g., 'CSE A')
        course_id: Course ID (sheet name in Excel)
    
    Returns:
        Dictionary with success status, student data, marks, and recommendations
    """
    try:
        # Load model files
        model_file_path = f"{course_id}_dataset_model.joblib"
        mlb_file_path = f"{course_id}_dataset_mlb.joblib"
        
        # Check if model files exist
        if not os.path.isfile(model_file_path) or not os.path.isfile(mlb_file_path):
            return {
                'success': False,
                'error': f'Model files not found. Please ensure {model_file_path} and {mlb_file_path} exist.'
            }
        
        # Load pre-trained model and MultiLabelBinarizer
        loaded_model = joblib.load(model_file_path)
        mlb = joblib.load(mlb_file_path)
        
        # Read student data
        df_students = pd.read_excel(STUDENTS_EXCEL_FILENAME, sheet_name=course_id)
        df_courses = pd.read_excel(COURSE_EXCEL_FILENAME, sheet_name=course_id)
        
        # Find the student
        result = df_students[
            (df_students['Class'] == class_id) & 
            (df_students['Student Id'] == int(student_id))
        ]
        
        if result.empty:
            return {
                'success': False,
                'error': f'Student {student_id} not found in class {class_id}'
            }
        
        student_row = result.iloc[0]
        
        # Get assessments and converted marks
        Assessments = list(df_courses['Assessments'])
        Converted_Assessments_name = []
        
        for i, j in enumerate(Assessments):
            converted_column_name = j + ' Converted'
            Converted_Assessments_name.append(converted_column_name)
        
        # Get student's converted marks
        stu_marks = {}
        for assessment, converted_name in zip(Assessments, Converted_Assessments_name):
            original_mark = student_row.get(assessment, 0)
            converted_mark = student_row.get(converted_name, 0)
            stu_marks[assessment] = {
                'original': float(original_mark) if pd.notna(original_mark) else 0,
                'converted': float(converted_mark) if pd.notna(converted_mark) else 0
            }
        
        # Get recommendation from the spreadsheet
        recommendation = student_row.get('Recommendation', 'No recommendation available')
        
        # Parse recommendations into a list
        if pd.notna(recommendation) and recommendation:
            recommendation_list = [r.strip() for r in str(recommendation).split(';') if r.strip()]
        else:
            recommendation_list = []
        
        # Get total marks
        total_marks = float(student_row.get('Total', 0)) if pd.notna(student_row.get('Total')) else 0
        
        # Get student name
        student_name = student_row.get('Name', f'Student {student_id}')
        
        return {
            'success': True,
            'student_id': int(student_id),
            'student_name': student_name,
            'class_id': class_id,
            'course_id': course_id,
            'total_marks': total_marks,
            'marks': stu_marks,
            'recommendation': recommendation,
            'recommendation_list': recommendation_list,
            'steps_to_improve': recommendation_list  # Alias for frontend
        }
        
    except FileNotFoundError as e:
        return {
            'success': False,
            'error': f'File not found: {str(e)}. Ensure Students.xlsx and Courses.xlsx exist.'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Error getting recommendations: {str(e)}'
        }

def get_all_students_marks(course_id: str) -> Dict[str, Any]:
    """
    Get marks for all students (useful for leaderboard).
    This is for reference/testing only.
    
    Args:
        course_id: Course ID (sheet name in Excel)
    
    Returns:
        Dictionary with students data
    """
    try:
        df_students = pd.read_excel(STUDENTS_EXCEL_FILENAME, sheet_name=course_id)
        
        students_list = []
        for _, row in df_students.iterrows():
            students_list.append({
                'student_id': int(row.get('Student Id', 0)),
                'name': row.get('Name', 'Unknown'),
                'class': row.get('Class', 'Unknown'),
                'total_marks': float(row.get('Total', 0)) if pd.notna(row.get('Total')) else 0
            })
        
        return {
            'success': True,
            'students': students_list,
            'total': len(students_list),
            'course_id': course_id
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': f'Error fetching students: {str(e)}'
        }

# Legacy function wrapper for backward compatibility
def findthem_inference(student_id: int, class_id: str, course_id: str) -> Dict[str, Any]:
    """
    Inference-only version of findthem() from original mlcode.py.
    Returns data instead of showing messagebox.
    """
    return get_student_recommendation_data(student_id, class_id, course_id)
