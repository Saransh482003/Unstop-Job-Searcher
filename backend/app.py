from fastapi import FastAPI, HTTPException
from unstopjobsearcher import UnstopJobSearcher
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
from dotenv import load_dotenv
import os

app = FastAPI()

load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the job searcher with default headers
headers = {
    "cookie":os.getenv("UNSTOP_COOKIE"),
    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
}
job_searcher = UnstopJobSearcher(headers)

@app.get("/search-jobs/")
async def search_jobs(
    title: str,
    location: str,
    type: Optional[str] = "jobs"
):
    try:
        # Search for jobs using the UnstopJobSearcher
        results_df = job_searcher.search_jobs(title, location, type)
        results_df = results_df.replace([np.inf, -np.inf], np.nan).fillna(value="")
        
        # Convert DataFrame to dictionary format
        jobs_list = results_df.to_dict(orient='index')
        return {
            "status": "success",
            "data": jobs_list,
            "count": len(jobs_list)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Job Search API"}