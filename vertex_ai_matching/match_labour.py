import pandas as pd
import re
from vertexai.preview.language_models import TextEmbeddingModel
import vertexai
import gspread
from google.oauth2.service_account import Credentials
from sklearn.metrics.pairwise import cosine_similarity

# ==== INIT VERTEX AI ====
vertexai.init(project="vertex-ai-456914", location="us-central1")
model = TextEmbeddingModel.from_pretrained("text-embedding-005")

# ==== CONFIG ====
SPREADSHEET_ID = "1p7zEfbYhyuxdiKDjW0iT5dptkENHtg0YU4X8rlJdshk"
SHEET_EMP = "lb_emp"
SHEET_HR = "lb_user"
SERVICE_ACCOUNT_FILE = "service_account.json"

# ==== GOOGLE SHEETS AUTH ====
scope = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=scope)
gc = gspread.authorize(creds)
sheet = gc.open_by_key(SPREADSHEET_ID)

# ==== READ DATA ====
df_candidates = pd.DataFrame(sheet.worksheet(SHEET_EMP).get_all_records())
df_jobs = pd.DataFrame(sheet.worksheet(SHEET_HR).get_all_records())

# ==== TEXT FORMATTING ====
def sanitize_title(title):
    return re.sub(r'\W+', '_', title.strip()).lower()

def candidate_text(row):
    return f"""
    Name: {row['name']}.
    Skills: {row['skills']}.
    Experience: {row.get('experience', 'NA')}.
    Location: {row.get('location', 'NA')}.
    Preferred Job Type: {row.get('preferred_role', 'General')}.
    """

def job_text_fn(row):
    return f"""
    Job Title: {row['job_title']}.
    Required Skills: {row['required_skills']}.
    Location: {row['job_location']}.
    Description: {row['job_description']}.
    """

# ==== EMBED CANDIDATES ====
candidate_texts = df_candidates.apply(candidate_text, axis=1).tolist()
candidate_embeddings = model.get_embeddings(candidate_texts)
candidate_names = df_candidates['name'].tolist()

MATCH_THRESHOLD = 0.6

# ==== JOB MATCHING LOOP ====
for _, job in df_jobs.iterrows():
    job_id = job['job_id'] if 'job_id' in job else sanitize_title(job['job_title'])
    job_embed = model.get_embeddings([job_text_fn(job)])[0].values



    results = []
    for idx, cand_row in df_candidates.iterrows():
        cand_embed = candidate_embeddings[idx].values
        score = cosine_similarity([cand_embed], [job_embed])[0][0]
        if score >= MATCH_THRESHOLD:
            results.append({
                'Candidate Name': candidate_names[idx],
                'Match Score': round(score, 4)
            })

    results = sorted(results, key=lambda x: x['Match Score'], reverse=True)

    sheet_name = f"match_lb_{job_id}"
    try:
        ws = sheet.worksheet(sheet_name)
        sheet.del_worksheet(ws)
    except:
        pass

    ws = sheet.add_worksheet(title=sheet_name, rows=100, cols=2)
    ws.update([["Candidate Name", "Match Score"]] + [[r['Candidate Name'], r['Match Score']] for r in results])
    print(f"✅ Match results written to tab: {sheet_name}")

