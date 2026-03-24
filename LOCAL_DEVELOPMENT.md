# Local Development Guide

## Quick Start (5 Minutes)

### Terminal 1: Flask API Backend
```bash
cd e:\drop\Upgrade-main

# One time setup
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Run Flask server
python -m flask --app "upgrade-build.api.index" run --port=5000
```

**Server running at**: http://localhost:5000

### Terminal 2: Generate ML Models (If Not Done)
```bash
cd e:\drop\Upgrade-main

# One time: Generate trained models
python mlcode.py
```

This creates the .joblib files that the API uses.

### Terminal 3: Next.js Frontend
```bash
cd e:\drop\Upgrade-main\upgrade-build

# One time setup
npm install

# Create .env.local
cp .env.local.example .env.local

# Run development server
npm run dev
```

**Frontend running at**: http://localhost:3000

### Browser
1. Go to http://localhost:3000
2. Click Login
3. Enter Roll No: **22001**
4. Password: **demo123**
5. See your marks and recommendations!

---

## File Structure

```
upgrade-main/
├── mlcode.py                    ← Original ML code
├── mlcode_inference.py          ← Inference-only for API
├── Students.xlsx                ← Student data
├── Courses.xlsx                 ← Course config
├── Default_*.joblib             ← Pre-trained models
│
└── upgrade-build/
    ├── api/
    │   └── index.py             ← Flask API (Vercel serverless)
    │
    ├── hooks/
    │   └── use-student.ts       ← API client hook
    │
    ├── components/
    │   └── student-analysis.tsx ← Marks & recommendations display
    │
    ├── app/
    │   ├── login/page.tsx       ← Login page
    │   └── profile/page.tsx     ← Dashboard
    │
    ├── .env.local               ← Local config (git ignored)
    └── package.json
```

---

## Environment Setup

### .env.local
```
NEXT_PUBLIC_API_URL=/api
```

This tells Next.js to use the relative `/api` path, which proxies to Flask.

---

## Testing API Endpoints

### Using curl

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"roll_no": 22001, "password": "demo123"}'

# Get recommendations (replace TOKEN with your token)
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"roll_no": 22001}'

# Leaderboard
curl http://localhost:5000/api/leaderboard

# Top 5 students
curl http://localhost:5000/api/top-five
```

### Using Python
```python
import requests

# Login
response = requests.post('http://localhost:5000/api/login', json={
    'roll_no': 22001,
    'password': 'demo123'
})
print(response.json())

# Get token
token = response.json()['token']

# Get recommendations
response = requests.post(
    'http://localhost:5000/api/recommend',
    json={'roll_no': 22001},
    headers={'Authorization': f'Bearer {token}'}
)
print(response.json())
```

---

## Debugging

### Check Flask API is running
```bash
curl http://localhost:5000/api/health
# Should return: {"status": "ok", "message": "..."}
```

### Check Next.js is running
```bash
curl http://localhost:3000/
# Should return HTML
```

### View Flask logs
The Flask server will show logs in the terminal:
```
127.0.0.1 - - [24/Mar/2026 10:30:45] "POST /api/login HTTP/1.1" 200 -
```

### View Next.js logs
The Next.js server will show:
```
- compiled successfully
- compiled client and server successfully
```

### Browser console errors
Press F12 in browser → Console tab to see JavaScript errors

---

## Common Issues

### "GET /api/recommend": Method not allowed
**Fix**: Use POST not GET
```bash
# Wrong:
curl http://localhost:5000/api/recommend

# Correct:
curl -X POST http://localhost:5000/api/recommend
```

### "Connection refused" at localhost:5000
**Fix**: Flask not running in Terminal 1
```bash
cd upgrade-main
python -m flask --app "upgrade-build.api.index" run --port=5000
```

### "Student not found" on login
**Cause**: Roll number not in Students.xlsx top 5

**Fix**: Add student to Students.xlsx or use 22001-22005

### Models not found error
**Fix**: Generate them locally first
```bash
python mlcode.py
```

### "Port 5000 already in use"
**Fix**: Kill the process or use different port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID YOUR_PID /F

# Or use different port
python -m flask --app "upgrade-build.api.index" run --port=5001
```

---

## Testing the Login Flow

1. **Frontend sends login request**
   - Frontend: `/login` form
   - Sends: `{ roll_no: 22001, password: "demo123" }`

2. **API validates and authenticates**
   - API: `/api/login` endpoint
   - Checks: student in top 5?
   - Returns: JWT token

3. **Frontend stores token**
   - Stores in localStorage
   - Redirects to `/profile`

4. **Backend fetches student data**
   - API: `/api/recommend` endpoint
   - Uses: JWT token for verification
   - Returns: student marks + recommendations

5. **Frontend displays results**
   - Shows marks breakdown
   - Shows 'Steps to Improve' in bulleted list
   - Shows performance level icon

---

## Data Flow

```
User Types:
22001, demo123
    ↓
Frontend Login Form
    ↓
POST /api/login
    ↓
Flask verifies_top_five(22001)
    ↓
Generates JWT token
    ↓
Returns token to frontend
    ↓
Frontend stores token, redirects
    ↓
POST /api/recommend with token
    ↓
Flask calls get_student_recommendation_data()
    ↓
Returns marks + recommendations
    ↓
Frontend displays StudentAnalysis component
    ↓
✅ Dashboard shows marks & improvements
```

---

## Making Changes

### Adding a new API endpoint

**In `upgrade-build/api/index.py`:**
```python
@app.route('/api/new-endpoint', methods=['POST'])
def new_endpoint():
    data = request.get_json()
    # Your logic here
    return jsonify({'result': 'success'})
```

**In `upgrade-build/hooks/use-student.ts`:**
```typescript
const myNewFunction = useCallback(async () => {
    return apiCall('/new-endpoint', 'POST', { /* data */ });
}, [apiCall]);
```

**In components:**
```typescript
const { myNewFunction } = useStudent();
// Call it wherever needed
```

### Modifying student marks display

**File**: `upgrade-build/components/student-analysis.tsx`

The component uses `analysis.marks` object to display each assessment.

### Testing changes

After making changes:
```bash
# For Flask API changes - just save, Flask auto-reloads
# For Next.js changes - save and it auto-refreshes
```

---

## Production Deployment to Vercel

Once everything works locally:

1. Commit code to GitHub
2. Connect GitHub to Vercel
3. Set environment variables
4. Deploy with one click!

See `VERCEL_DEPLOYMENT.md` for full instructions.

---

## Python/Node Version Requirements

- **Python**: 3.8+
- **Node.js**: 18+
- **npm**: 8+

Check versions:
```bash
python --version
node --version
npm --version
```

---

## Useful Commands

```bash
# Check if port is in use
netstat -ano | findstr :PORT

# Clear npm cache
npm cache clean --force

# Install specific package version
npm install package@1.2.3

# Update all packages
npm update

# Virtual environment
python -m venv venv
venv\Scripts\activate
deactivate

# Install from requirements.txt
pip install -r requirements.txt -r upgrade-build/requirements.txt

# Export requirements
pip freeze > requirements.txt
```

---

## Next.js Build Optimization

```bash
cd upgrade-build

# Build for production locally
npm run build

# Start production build locally
npm start

# Analyze bundle size
npm run build -- --analyze
```

---

## Performance Tips

1. **Faster API**: Keep Excel files small (<1000 students)
2. **Faster Frontend**: Use React.memo for components that don't change
3. **Caching**: API caches StudentData for 5 minutes
4. **Models**: Pre-trained models load fast (~100ms)

---

That's it! You're ready to develop locally! 🚀

Any issues? Check the troubleshooting section or the main documentation files.
