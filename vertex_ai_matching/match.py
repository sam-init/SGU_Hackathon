<<<<<<< HEAD
import pandas as pd
import re
import gspread
from sklearn.metrics.pairwise import cosine_similarity
from vertexai.preview.language_models import TextEmbeddingModel
from google.oauth2.service_account import Credentials
import vertexai

# ==== VERTEX INIT ====
vertexai.init(project="vertex-ai-456914", location="us-central1")

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
def sanitize_title(title):
    return re.sub(r'\W+', '_', title.strip()).lower()

def candidate_text(row):
    return f"""
    Candidate Name: {row['name']}.
    Skills: {row['skills']}.
    Experience: {row['experience']}.
    Education: {row['education']}.
    Location: {row['location']}.
    Preferred Role: {row['preferred_role']}.
    """

def job_text_fn(row):
    return f"""
    Job Title: {row['job_title']}.
    Required Skills: {row['required_skills']}.
    Experience Required: {row['experience_required']}.
    Job Location: {row['job_location']}.
    Job Description: {row['job_description']}.
    """

# ==== EMBED CANDIDATES ====
candidate_texts = df_candidates.apply(candidate_text, axis=1).tolist()
candidate_embeddings = model.get_embeddings(candidate_texts)
candidate_names = df_candidates['name'].tolist()

# ==== JOB MATCHING LOOP ====
for _, job in df_jobs.iterrows():
    job_id = job['job_id'] if 'job_id' in job else sanitize_title(job['job_title'])
    job_embed = model.get_embeddings([job_text_fn(job)])[0].values

    results = []
    for idx, cand_row in df_candidates.iterrows():
        cand_embed = candidate_embeddings[idx].values
        score = cosine_similarity([cand_embed], [job_embed])[0][0]
        results.append({
            'Candidate Name': candidate_names[idx],
            'Match Score': round(score, 4)
        })

    results = sorted(results, key=lambda x: x['Match Score'], reverse=True)

    sheet_name = f"match_result_{job_id}"
    try:
        ws = sheet.worksheet(sheet_name)
        sheet.del_worksheet(ws)
    except:
        pass

    ws = sheet.add_worksheet(title=sheet_name, rows=100, cols=2)
    ws.update([["Candidate Name", "Match Score"]] + [[r['Candidate Name'], r['Match Score']] for r in results])
=======
import pandas as pd
import re
import gspread
from sklearn.metrics.pairwise import cosine_similarity
from vertexai.preview.language_models import TextEmbeddingModel
from google.oauth2.service_account import Credentials
import vertexai

# ==== VERTEX INIT ====
vertexai.init(project="vertex-ai-456914", location="us-central1")

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
def sanitize_title(title):
    return re.sub(r'\W+', '_', title.strip()).lower()

def candidate_text(row):
    return f"""
    Candidate Name: {row['name']}.
    Skills: {row['skills']}.
    Experience: {row['experience']}.
    Education: {row['education']}.
    Location: {row['location']}.
    Preferred Role: {row['preferred_role']}.
    """

def job_text_fn(row):
    return f"""
    Job Title: {row['job_title']}.
    Required Skills: {row['required_skills']}.
    Experience Required: {row['experience_required']}.
    Job Location: {row['job_location']}.
    Job Description: {row['job_description']}.
    """

# ==== EMBED CANDIDATES ====
candidate_texts = df_candidates.apply(candidate_text, axis=1).tolist()
candidate_embeddings = model.get_embeddings(candidate_texts)
candidate_names = df_candidates['name'].tolist()

# ==== JOB MATCHING LOOP ====
for _, job in df_jobs.iterrows():
    job_id = job['job_id'] if 'job_id' in job else sanitize_title(job['job_title'])
    job_embed = model.get_embeddings([job_text_fn(job)])[0].values

    results = []
    for idx, cand_row in df_candidates.iterrows():
        cand_embed = candidate_embeddings[idx].values
        score = cosine_similarity([cand_embed], [job_embed])[0][0]
        results.append({
            'Candidate Name': candidate_names[idx],
            'Match Score': round(score, 4)
        })

    results = sorted(results, key=lambda x: x['Match Score'], reverse=True)

    sheet_name = f"match_result_{job_id}"
    try:
        ws = sheet.worksheet(sheet_name)
        sheet.del_worksheet(ws)
    except:
        pass

    ws = sheet.add_worksheet(title=sheet_name, rows=100, cols=2)
    ws.update([["Candidate Name", "Match Score"]] + [[r['Candidate Name'], r['Match Score']] for r in results])
>>>>>>> e5ba5c93687333bbf30be6818f78ffb5a5881d47
    print(f"✅ Match results written to tab: {sheet_name}")