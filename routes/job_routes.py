from flask import Flask, request, render_template, redirect, url_for,jsonify,Blueprint
import json
import gspread
from routes.config import db
from google.oauth2 import service_account
# ---- this is the **sync** client you referenced ----
from algoliasearch.search.client import SearchClientSync
job_bp=Blueprint('job',__name__)

SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/spreadsheets']
google_creds = service_account.Credentials.from_service_account_file(
    'flask-62adb-firebase-adminsdk-fbsvc-94d4843991.json', scopes=SCOPES)
gc = gspread.authorize(google_creds)
SHEET = gc.open_by_key("1jqevTaHVGuDJTnusng_YkcpgOiOzFckt3eYWKO-qF7s").worksheet("Sheet2")


# ——— Algolia setup ———
ALGOLIA_APP_ID     = "2P758DV8OF"
ALGOLIA_API_KEY    = "f27a5a70218960fb04371982e2ae2a50"
ALGOLIA_INDEX_NAME = "jobs"

# create the sync client
algolia_client = SearchClientSync(ALGOLIA_APP_ID, ALGOLIA_API_KEY)

@job_bp.route('/post_job', methods=['POST', 'GET'])
def post_job():
    if request.method == 'POST':
        title = request.form.get('title')
        company = request.form.get('company')
        location = request.form.get('location')
        job_type = request.form.get('job_type')
        salary = request.form.get('salary')
        raw_skills = request.form.get('skills')
        description = request.form.get('description')
        requirements = request.form.get('requirements')

        skills_list = [s.strip().lower() for s in raw_skills.split(',') if s.strip()]

        job = {
            'title': title,
            'company': company,
            'location': location,
            'job_type': job_type,
            'salary': salary,
            'skills': skills_list,
            'description': description,
            'requirements': requirements
        }

        _, doc_ref = db.collection('jobs').add(job)
        object_id = doc_ref.id

        record = {**job, 'objectID': object_id}
        save_resp = algolia_client.save_object(
            index_name=ALGOLIA_INDEX_NAME,
            body=record
        )
        algolia_client.wait_for_task(
            index_name=ALGOLIA_INDEX_NAME,
            task_id=save_resp.task_id
        )

        # Append to Google Sheet
        SHEET.append_row([
            title, company, location, job_type,
            salary, ', '.join(skills_list), description, requirements
        ])

    return render_template('Employer.html')




@job_bp.route('/search_jobs', methods=['GET'])
def search_jobs():
    query = request.args.get('query', '')  # Query typed by user
    
    # Perform Algolia search
    try:
        search_results = algolia_client.search(
            index_name=ALGOLIA_INDEX_NAME,
            query=query
        )
        job_hits = search_results['hits']  # Results of the search

        # Return relevant data for autocomplete (e.g., job titles)
        suggestions = [{'title': hit['title'], 'objectID': hit['objectID']} for hit in job_hits]

        return jsonify(suggestions)

    except Exception as e:
        print(f"Error during Algolia search: {e}")
        return jsonify([])  # Return an empty list in case of an error


@job_bp.route('/jobs', methods=['GET'])
def job_listings():
    query = request.args.get('query', '')  # Search query
    location_filter = request.args.get('location', '')  # Location filter
    skills_filter = request.args.get('skills', '')  # Skills filter
    job_type_filter = request.args.get('job_type', '')  # Job type filter

    # Construct search filters for Algolia
    filters = []
    if location_filter:
        filters.append(f"location:{location_filter}")
    if skills_filter:
        filters.append(f"skills:{skills_filter}")
    if job_type_filter:
        filters.append(f"job_type:{job_type_filter}")

    # Combine filters into a string
    filter_string = " AND ".join(filters) if filters else ""

    # Perform Algolia search
    try:
        search_results = algolia_client.search(
            index_name=ALGOLIA_INDEX_NAME,
            query=query,
            filters=filter_string
        )
        job_hits = search_results['hits']  # Results of the search
    except Exception as e:
        print(f"Error during Algolia search: {e}")
        job_hits = []

    # Render the job listings page with the search results
    return render_template('job_listings.html', jobs=job_hits, query=query)
