import pandas as pd
import gspread
import re
from google.oauth2.service_account import Credentials
from vertexai.language_models import TextEmbeddingModel
from sklearn.metrics.pairwise import cosine_similarity

# ==== CONFIG ====
SPREADSHEET_ID = "1p7zEfbYhyuxdiKDjW0iT5dptkENHtg0YU4X8rlJdshk"
SHEET_EMP = "coop_emp"
SHEET_HR = "coop_hr"
SERVICE_ACCOUNT_FILE = "service_account.json"

# ==== GOOGLE SHEETS AUTH ====
scope = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=scope)
gc = gspread.authorize(creds)
sheet = gc.open_by_key(SPREADSHEET_ID)

# ==== READ DATA ====
df_candidates = pd.DataFrame(sheet.worksheet(SHEET_EMP).get_all_records())
df_jobs = pd.DataFrame(sheet.worksheet(SHEET_HR).get_all_records())

# ==== INIT MODEL ====
model = TextEmbeddingModel.from_pretrained("text-embedding-005")

# ==== UTILS ====
def candidate_text(row):
    return f"""
    Candidate Name: {row['name']}.
    Skills: {row['skills']}.
    Experience: {row['experience']}.
    Education: {row['education']}.
    Location: {row['location']}.
    Preferred Role: {row['preferred_role']}.
    """

def job_text(row):
    return f"""
    Job Title: {row['job_title']}.
    Required Skills: {row['required_skills']}.
    Experience Required: {row['experience_required']}.
    Job Location: {row['job_location']}.
    Job Description: {row['job_description']}.
    """

# ==== EMBEDDING CANDIDATES ONCE ====
candidate_texts = df_candidates.apply(candidate_text, axis=1).tolist()
candidate_embeddings = model.get_embeddings(candidate_texts)

import re

def sanitize_title(title):
    return re.sub(r'\W+', '_', title.strip()).lower()

# Loop through jobs and compute match + write results
for _, job in jobs_df.iterrows():
    job_id = job['job_id'] if 'job_id' in job else sanitize_title(job['title'])
    job_text = build_job_text(job)
    job_embedding = model.get_embeddings([job_text])[0].values

    results = []

    for _, cand in candidates_df.iterrows():
        cand_text = build_candidate_text(cand)
        cand_embedding = model.get_embeddings([cand_text])[0].values
        score = cosine_similarity([cand_embedding], [job_embedding])[0][0]
        results.append({'Candidate Name': cand['name'], 'Match Score': round(score, 4)})

    # Sort by match score
    ranked_results = sorted(results, key=lambda x: x['Match Score'], reverse=True)

    # Create new sheet or overwrite
    sheet_name = f"match_result_{job_id}"
    try:
        worksheet = sh.worksheet(sheet_name)
        sh.del_worksheet(worksheet)
    except:
        pass

    worksheet = sh.add_worksheet(title=sheet_name, rows=100, cols=2)
    worksheet.update([["Candidate Name", "Match Score"]] + [[r['Candidate Name'], r['Match Score']] for r in ranked_results])
    print(f"✅ Match results written to tab: {sheet_name}")
