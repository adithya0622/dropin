# Flask API Helper Functions Documentation

## Overview

The Flask API uses helper functions to validate students and manage authentication. These functions are designed for serverless deployment on Vercel with no model retraining.

## Key Helper Functions

### 1. `verify_top_five(roll_no: int)`

**Purpose**: Verify if a student is in the top 5 performers and issue a JWT token for authentication.

**Location**: `upgrade-build/api/index.py`

**Parameters**:
- `roll_no` (int): Student ID to verify

**Returns**: Dictionary with the following structure:
```python
{
    'success': bool,                      # True if student is in top 5
    'token': str,                         # JWT token (if success)
    'roll_no': int,                       # Student ID
    'student_name': str,                  # Student's name
    'total_marks': float,                 # Student's total marks
    'message': str,                       # Success message
    'error': str,                         # Error message (if not success)
    'status_code': int                    # HTTP status code
}
```

**Example Usage**:
```python
result = verify_top_five(22001)
if result['success']:
    token = result['token']
    print(f"Welcome {result['student_name']}")
else:
    print(result['error'])  # "Access restricted to top-performing students only"
```

**How It Works**:
1. Loads Students.xlsx file
2. Sorts all students by 'Total' column (descending)
3. Gets the top 5 students
4. Checks if the provided roll_no is in the top 5
5. If yes: generates JWT token and returns success
6. If no: returns 401 error

---

### 2. `get_student_recommendation_data(...)`

**Purpose**: Get student marks and ML-generated recommendations without retraining the model.

**Location**: `upgrade-build/mlcode_inference.py`

**Parameters**:
- `student_id` (int): Student ID
- `class_id` (str): Class name (e.g., 'CSE A')
- `course_id` (str): Course ID (sheet name)

**Returns**: Dictionary with structure:
```python
{
    'success': bool,                      # True if data fetched successfully
    'student_id': int,                    # Student ID
    'student_name': str,                  # Student name
    'class_id': str,                      # Class ID
    'course_id': str,                     # Course ID
    'total_marks': float,                 # Total marks
    'marks': {                            # Individual assessment marks
        'Assessment Name': {
            'original': float,            # Original marks
            'converted': float            # Converted/normalized marks
        }
    },
    'recommendation': str,                # Full recommendation string
    'recommendation_list': list,          # Recommendation as list
    'steps_to_improve': list,            # Same as recommendation_list
    'error': str                          # Error message (if not success)
}
```

**Example Usage**:
```python
data = get_student_recommendation_data(22001, 'CSE A', 'Default')
if data['success']:
    print(f"Student: {data['student_name']}")
    print(f"Total Marks: {data['total_marks']}")
    print(f"Recommendations: {data['steps_to_improve']}")
else:
    print(data['error'])
```

**How It Works**:
1. Loads pre-trained ML model from `{course_id}_dataset_model.joblib`
2. Loads MultiLabelBinarizer from `{course_id}_dataset_mlb.joblib`
3. Fetches student data from Students.xlsx
4. Gets converted marks for each assessment
5. Returns recommendations from the spreadsheet
6. **Does NOT retrain the model** - only inference

---

### 3. `verify_token(f)` - Decorator

**Purpose**: Decorator to verify JWT tokens in protected routes.

**Location**: `upgrade-build/api/index.py`

**Usage**:
```python
@app.route('/api/recommend', methods=['POST'])
@verify_token  # Apply decorator to protect route
def recommend():
    # Route is now protected by JWT verification
    pass
```

**How It Works**:
1. Extracts JWT token from `Authorization` header
2. Decodes and validates token signature
3. Checks if token has expired
4. Sets `request.roll_no` with the student ID from token
5. Returns 401 error if token is invalid or missing

---

## Important Notes for Vercel Deployment

### Model Files MUST Exist Beforehand

The API **does not train models** - it only loads pre-trained `.joblib` files:
- `Default_dataset_model.joblib` - Pre-trained ML model
- `Default_dataset_mlb.joblib` - MultiLabelBinarizer

**You must generate these files locally before deploying:**

```bash
# On your laptop (DO ONCE):
python mlcode.py
# This will create:
# - Default_train_dataset.xlsx
# - Default_dataset_model.joblib
# - Default_dataset_mlb.joblib
```

**Then upload these .joblib files to GitHub/Vercel**

### File Caching

The `get_students_df()` function caches Students.xlsx for 5 minutes to reduce I/O:
```python
# Cache refreshes automatically every 5 minutes
# This is important for Vercel's cold starts
```

### Password Hardcoded

The password is hardcoded as 'demo123' in the API:
```python
PASSWORD = 'demo123'  # Change in production!
```

For production, move this to environment variables:
```python
PASSWORD = os.environ.get('API_PASSWORD', 'default')
```

---

## API Endpoints Using These Functions

### `/api/login` - POST

Uses `verify_top_five()` to authenticate students:
```json
{
    "roll_no": 22001,
    "password": "demo123"
}
```

**Response**:
```json
{
    "success": true,
    "token": "eyJ0eXAiOiJKV1QiLCJh...",
    "roll_no": 22001,
    "student_name": "John Doe",
    "total_marks": 250,
    "message": "Authentication successful"
}
```

### `/api/recommend` - POST

Uses `get_student_recommendation_data()` to fetch recommendations:
```json
{
    "roll_no": 22001
}
```

**Response**:
```json
{
    "success": true,
    "student_id": 22001,
    "student_name": "John Doe",
    "total_marks": 250,
    "marks": {
        "Mid Term": {"original": 45, "converted": 22},
        "End Term": {"original": 72, "converted": 36},
        ...
    },
    "steps_to_improve": [
        "Increase study time on core concepts",
        "Practice previous year papers"
    ]
}
```

---

## Error Handling

### Possible Errors

| Error | Cause | HTTP Status |
|-------|-------|------------|
| `Access restricted to top-performing students only` | Roll number not in top 5 | 401 |
| `Model files not found` | `.joblib` files missing | 500 |
| `Student not found` | Roll number doesn't exist | 404 |
| `Invalid password` | Wrong password | 401 |
| `Invalid token` | JWT token expired or invalid | 401 |

---

## Testing Helper Functions

### Local Testing

```python
from api.index import verify_top_five
from mlcode_inference import get_student_recommendation_data

# Test authentication
result = verify_top_five(22001)
print(result)

# Test recommendations
data = get_student_recommendation_data(22001, 'CSE A', 'Default')
print(data)
```

### Testing via curl

```bash
# Test health
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"roll_no": 22001, "password": "demo123"}'

# Test recommendations
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"roll_no": 22001}'
```

---

## Performance Considerations

### Caching Strategy

- **Students.xlsx**: Cached for 5 minutes
- **Model Files**: Loaded once in memory (Vercel keeps them)
- **Database Connections**: None (uses Excel files only)

### Cold Start Optimization

- Model files are loaded lazily (on first request)
- JWT validation is fast (no database queries)
- No heavy computations - only inference

### Scaling

For many users, consider:
1. Converting Excel to SQLite database
2. Caching model predictions in Redis
3. Using Vercel's edge cache for leaderboard

---

## Security

### Current Implementation
- ⚠️ Password hardcoded (demo123)
- ✅ JWT tokens expire after 24 hours
- ✅ Students can only see their own data

### For Production
1. Move password to environment variables
2. Add rate limiting
3. Use HTTPS only
4. Implement refresh tokens
5. Add audit logging
6. Enable CORS only for trusted domains

---

## Troubleshooting

### "Model files not found" error

**Cause**: `.joblib` files haven't been generated

**Solution**:
```bash
# On your local machine, run once:
cd e:\drop\Upgrade-main
python mlcode.py
```

### "Student not found" error

**Cause**: Roll number doesn't exist in Students.xlsx

**Solution**: 
- Add the student to Students.xlsx
- Ensure column names match exactly
- Verify course/sheet name matches

### JWT token errors

**Cause**: Token expired or invalid

**Solution**:
- Tokens expire after 24 hours
- User needs to login again to get a new token
- Check token format is `Bearer YOUR_TOKEN`

---

## Summary

| Function | Purpose | Retrains Model? | Uses JWT? |
|----------|---------|-----------------|-----------|
| `verify_top_five()` | Verify student + issue token | ❌ No | ❌ Issues it |
| `get_student_recommendation_data()` | Fetch student data & recommendations | ❌ No | ✅ Independent |
| `verify_token()` | Protect API routes | N/A | ✅ Validates it |

All functions are designed for fast, serverless execution on Vercel with **zero model retraining**.
