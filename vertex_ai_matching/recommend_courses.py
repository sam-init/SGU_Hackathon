import pandas as pd
import gspread
import requests
import urllib.parse
import time
import google.generativeai as genai
import concurrent.futures
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials

# ==== CONFIG ====
SHEET_ID = "1gz85Kt6E_Lwu4GBiG-7z9jeB_iCIRE34Wtcf47aaa-0"
SHEET_EMP = "coop_emp_yt"
SHEET_OUT = "coop_emp_yt_op"
SERVICE_ACCOUNT_FILE = "service_account.json"

GEMINI_MODEL = "gemini-2.5-pro-preview-03-25"
YT_API_KEY = "AIzaSyD3WWXfZ7MVyZ7ryaPKUxHgDOCUaC6hI-U"
GEMINI_API_KEY = "AIzaSyAQ7KUOo-wPqopGV3Vne1vct3Ag8DfwxhY"

# ==== GOOGLE SHEETS SETUP ====
scopes = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=scopes)
gc = gspread.authorize(creds)
sheet = gc.open_by_key(SHEET_ID)
ws_in = sheet.worksheet(SHEET_EMP)

# ==== READ DATA ====
df = pd.DataFrame(ws_in.get_all_records())

# ==== INIT GEMINI ====
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL)

# ==== INIT YOUTUBE ====
youtube = build("youtube", "v3", developerKey=YT_API_KEY)

def get_summary(row):
    prompt = f"""
    Given the following user info:
    Name: {row['name']}
    Skills: {row['skills']}
    Experience: {row['experience']}
    Education: {row['education']}
    Location: {row['location']}
    Preferred Role: {row['preferred_role']}

    Generate a brief summary (~3 lines) suggesting what they should focus on learning next to achieve their goal.
    """
    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(model.generate_content, prompt)
            response = future.result(timeout=20)
            return response.text.strip()
    except Exception as e:
        return f"Error: {e}"

def youtube_search(query, max_results=3):
    search_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": YT_API_KEY
    }
    try:
        response = requests.get(search_url, params=params)
        response.raise_for_status()
        results = response.json().get("items", [])
        video_links = [
            f"https://www.youtube.com/watch?v={item['id']['videoId']}"
            for item in results
        ]
        return "\n".join(video_links)
    except Exception as e:
        return f"Error: {e}"

# ==== PROCESS ====
summary_list = []
video_list = []

for _, row in df.iterrows():
    if pd.isnull(row['skills']) or pd.isnull(row['preferred_role']):
        summary_list.append("Insufficient data.")
        video_list.append("")
        continue

    summary = get_summary(row)
    yt_query = f"{row['preferred_role']} {row['skills']} course"
    yt_videos = youtube_search(yt_query)
    summary_list.append(summary)
    video_list.append(yt_videos)
    time.sleep(1)  # To avoid quota limits

output_df = df[["name"]].copy()
output_df["Summary"] = summary_list
output_df["Recommended Videos"] = video_list

# ==== WRITE TO SHEET ====
worksheet = sheet.worksheet(SHEET_OUT)
worksheet.clear()
worksheet.update([output_df.columns.values.tolist()] + output_df.values.tolist())

print("✅ Course recommendations written to coop_emp_yt_op")
