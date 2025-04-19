import os
from dotenv import load_dotenv 
load_dotenv()

import json
from firebase_admin import credentials, firestore
from flask import Blueprint
import gspread
from google.oauth2 import service_account
from googleapiclient.discovery import build

config_bp = Blueprint('config', __name__)

# Firebase Admin SDK

firebase_cred_json = os.getenv("FIREBASE_CRED")
cred_dict = json.loads(firebase_cred_json)
cred = credentials.Certificate(cred_dict)
db = firestore.client()

# Google Service Account for GDrive + Sheets
SCOPES = os.getenv('GOOGLE_SCOPES').split()
google_cred_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
google_creds = service_account.Credentials.from_service_account_info(
    json.loads(google_cred_json),
    scopes=SCOPES
)
gc = gspread.authorize(google_creds)
GOOGLE_APPLICATION_CREDENTIALS = json.loads(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
# Sheets
sheet = gc.open_by_key(os.getenv("SHEET_KEY"))
SHEET1 = sheet.worksheet(os.getenv("SHEET1_NAME"))
SHEET2 = sheet.worksheet(os.getenv("SHEET2_NAME"))

# Drive
drive_service = build('drive', 'v3', credentials=google_creds)
FOLDER_ID = os.getenv('GDRIVE_FOLDER_ID')

# Algolia
ALGOLIA_APP_ID = os.getenv('ALGOLIA_APP_ID')
ALGOLIA_API_KEY = os.getenv('ALGOLIA_API_KEY')
ALGOLIA_INDEX_NAME = os.getenv('ALGOLIA_INDEX_NAME')

# Firebase Web API key
FIREBASE_WEB_API_KEY = os.getenv('FIREBASE_WEB_API_KEY')
