<<<<<<< HEAD
import gspread
from gspread_dataframe import get_as_dataframe
from oauth2client.service_account import ServiceAccountCredentials

def load_candidates_from_sheet(sheet_id, sheet_name="Sheet1"):
    scope = ["https://spreadsheets.google.com/feeds",
             "https://www.googleapis.com/auth/drive"]
    
    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "vertex_ai_matching/service_account.json", scope
    )

    client = gspread.authorize(creds)
    sheet = client.open_by_key(sheet_id)
    worksheet = sheet.worksheet(sheet_name)

    df = get_as_dataframe(worksheet, evaluate_formulas=True).dropna(how='all')
    return df
=======
import gspread
from gspread_dataframe import get_as_dataframe
from oauth2client.service_account import ServiceAccountCredentials

def load_candidates_from_sheet(sheet_id, sheet_name="Sheet1"):
    scope = ["https://spreadsheets.google.com/feeds",
             "https://www.googleapis.com/auth/drive"]
    
    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "vertex_ai_matching/service_account.json", scope
    )

    client = gspread.authorize(creds)
    sheet = client.open_by_key(sheet_id)
    worksheet = sheet.worksheet(sheet_name)

    df = get_as_dataframe(worksheet, evaluate_formulas=True).dropna(how='all')
    return df
>>>>>>> e5ba5c93687333bbf30be6818f78ffb5a5881d47
