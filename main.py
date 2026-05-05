from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import io
import PyPDF2
import re

app = FastAPI(title="AI Resume Analyzer")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount frontend files
app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("frontend/index.html", "r") as f:
        return f.read()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        return JSONResponse(status_code=400, content={"error": "Only PDF files are supported."})
    
    content = await file.read()
    
    try:
        # Simple PDF text extraction
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    except Exception as e:
        # Fallback if pdf parsing fails
        text = str(content)
        
    text_lower = text.lower()
    
    score = 50 # Base score
    suggestions = []
    skills_found = []
    
    keywords = {
        "python": 10,
        "machine learning": 10,
        "ai": 5,
        "react": 5,
        "docker": 5,
        "sql": 5,
        "fastapi": 5,
        "cloud": 5,
        "projects": 15,
        "experience": 10,
        "education": 5
    }
    
    for kw, points in keywords.items():
        if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
            score += points
            if kw not in ["projects", "experience", "education"]:
                if kw == "ai":
                    skills_found.append("AI")
                else:
                    skills_found.append(kw.title())
    
    if not re.search(r'\bprojects\b', text_lower):
        suggestions.append("Add a dedicated 'Projects' section to showcase your work.")
    if not re.search(r'\bexperience\b', text_lower):
        suggestions.append("Include details about your past work experience or internships.")
    
    # Check for numbers (quantified achievements)
    if not re.search(r'\d+', text_lower):
        suggestions.append("Quantify your achievements using numbers (e.g., 'Increased sales by 20%').")
        score -= 5
    else:
        score += 5
        
    score = min(score, 100) # Cap at 100
    score = max(score, 0) # Floor at 0
    
    if not suggestions:
        suggestions.append("Your resume looks great! Keep it tailored to the job description.")
        
    # Formatting experience
    exp_text = "Experienced" if re.search(r'\bexperience\b', text_lower) else "Entry-level"
        
    return {
        "score": score,
        "suggestions": suggestions,
        "skills": skills_found if skills_found else ["No specific tech skills detected"],
        "experience": exp_text
    }
