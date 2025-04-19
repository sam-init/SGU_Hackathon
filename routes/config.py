import os
from dotenv import load_dotenv 
load_dotenv()

import firebase_admin
from firebase_admin import credentials, firestore
from flask import Blueprint
import gspread
from google.oauth2 import service_account
from googleapiclient.discovery import build

config_bp = Blueprint('config', __name__)

# Firebase Admin SDK
firebase_cred_path = os.getenv('FIREBASE_ADMIN_CRED')
cred = credentials.Certificate(firebase_cred_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Google Service Account for GDrive + Sheets
SCOPES = os.getenv('GOOGLE_SCOPES').split()
google_cred_path = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
google_creds = service_account.Credentials.from_service_account_file(google_cred_path, scopes=SCOPES)
gc = gspread.authorize(google_creds)

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

GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
