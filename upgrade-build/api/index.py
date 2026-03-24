"""
Flask API for Upgrade - Student Recommendation System
Designed for Vercel serverless deployment
Only performs inference (no model retraining)
"""

from flask import Flask, request, jsonify
from functools import wraps
import pandas as pd
import os
import jwt
from datetime import datetime, timedelta

"""
Flask API for Upgrade - Student Recommendation System
Designed for Vercel serverless deployment
Only performs inference (no model retraining)
"""

from flask import Flask, request, jsonify
from functools import wraps
import pandas as pd
import os
import sys
import jwt
from datetime import datetime, timedelta

# Add parent directory to path for imports
repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

# Import inference-only functions (no model retraining)
try:
    from mlcode_inference import get_student_recommendation_data as get_recommendation
except ImportError:
    print("Warning: mlcode_inference not found, will fail on /api/recommend")
    get_recommendation = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'demo123-secret-key'  # Change in production

# ===== Configuration =====
PASSWORD = 'demo123'
COURSE_ID = 'Default'
CLASS_ID = 'CSE A'

# Get the root directory where Excel files are stored
# For Vercel, files are in the project root
FILES_DIR = os.environ.get('FILES_DIR', os.path.dirname(repo_root))
STUDENTS_FILE = os.path.join(FILES_DIR, 'Students.xlsx')
COURSES_FILE = os.path.join(FILES_DIR, 'Courses.xlsx')

# ===== Caching to avoid file reads on every request =====
_students_cache = None
_cache_timestamp = None

def get_students_df():
    """Load and cache Students.xlsx to avoid repeated file I/O"""
    global _students_cache, _cache_timestamp
    
    # Refresh cache every 5 minutes
    if _students_cache is not None and _cache_timestamp is not None:
        if (datetime.now() - _cache_timestamp).seconds < 300:
            return _students_cache
    
    try:
        if not os.path.exists(STUDENTS_FILE):
            raise FileNotFoundError(f"Students.xlsx not found at {STUDENTS_FILE}")
        
        df = pd.read_excel(STUDENTS_FILE, sheet_name=COURSE_ID)
        _students_cache = df
        _cache_timestamp = datetime.now()
        return df
    except Exception as e:
        raise Exception(f"Failed to load Students.xlsx: {str(e)}")

# ===== Helper Functions =====

def verify_top_five(roll_no: int):
    """
    Verify if a student is in the top 5 performers.
    
    Args:
        roll_no: Student ID to verify
        
    Returns:
        dict with success status, token, and message
    """
    try:
        df = get_students_df()
        
        # Sort by Total and get top 5
        top_five = df.nlargest(5, 'Total')
        top_five_ids = top_five['Student Id'].tolist()
        
        if roll_no not in top_five_ids:
            return {
                'success': False,
                'error': 'Access restricted to top-performing students only',
                'status_code': 401
            }
        
        # Generate JWT token
        payload = {
            'roll_no': roll_no,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        
        # Get student name and total
        student = df[df['Student Id'] == roll_no].iloc[0]
        
        return {
            'success': True,
            'token': token,
            'roll_no': roll_no,
            'student_name': student.get('Name', f'Student {roll_no}'),
            'total_marks': float(student.get('Total', 0)),
            'message': 'Authentication successful'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'status_code': 500
        }

def verify_token(f):
    """Decorator to verify JWT token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'Missing authorization token'}), 401
        
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            request.roll_no = payload['roll_no']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

# ===== API Routes =====

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Upgrade API is running on Vercel',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/login', methods=['POST'])
def login():
    """
    Login endpoint for students.
    Only top 5 students can login with password 'demo123'
    
    Expected JSON:
    {
        "roll_no": 22001,
        "password": "demo123"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        roll_no = data.get('roll_no')
        password = data.get('password')
        
        # Validate input
        if not roll_no or not password:
            return jsonify({'error': 'Missing roll_no or password'}), 400
        
        # Check password
        if password != PASSWORD:
            return jsonify({'error': 'Invalid password'}), 401
        
        # Verify student is in top 5
        result = verify_top_five(int(roll_no))
        
        if not result['success']:
            return jsonify({'error': result['error']}), result['status_code']
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/recommend', methods=['POST'])
def recommend():
    """
    Get student recommendation and marks.
    Requires valid JWT token.
    
    Expected JSON:
    {
        "roll_no": 22001
    }
    
    Returns student's marks and improvement recommendations
    """
    try:
        # Get token from header for verification
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if token:
            try:
                payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                verified_roll_no = payload['roll_no']
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Invalid token'}), 401
        else:
            # Allow without token for development
            pass
        
        data = request.get_json()
        roll_no = data.get('roll_no')
        
        if not roll_no:
            return jsonify({'error': 'Missing roll_no'}), 400
        
        # Get recommendation data (inference only - no model retraining)
        recommendation_data = get_recommendation(
            student_id=int(roll_no),
            class_id=CLASS_ID,
            course_id=COURSE_ID
        )
        
        if not recommendation_data['success']:
            return jsonify({'error': recommendation_data['error']}), 404
        
        return jsonify(recommendation_data), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/leaderboard', methods=['GET'])
def leaderboard():
    """
    Get top performing students leaderboard
    
    Query params:
    - limit: number of top students (default: 10)
    """
    try:
        limit = request.args.get('limit', 10, type=int)
        
        df = get_students_df()
        top_students = df.nlargest(limit, 'Total')[
            ['Student Id', 'Name', 'Class', 'Total']
        ].to_dict('records')
        
        return jsonify({
            'leaderboard': top_students,
            'total_students': len(df),
            'limit': limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/top-five', methods=['GET'])
def get_top_five():
    """Get list of top 5 students (for admin reference)"""
    try:
        df = get_students_df()
        top_five = df.nlargest(5, 'Total')[
            ['Student Id', 'Name', 'Total']
        ].to_dict('records')
        
        return jsonify({
            'top_five': top_five,
            'message': 'Only these students can login'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# ===== Error Handlers =====

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ===== Handler for Vercel =====
def handler(event, context):
    """Vercel serverless function handler"""
    return app(event, context)

if __name__ == '__main__':
    # For local development
    app.run(debug=True, port=5000)
