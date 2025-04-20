from flask import Flask, request, render_template, redirect, url_for,jsonify,Blueprint
import json
import gspread
from routes.config import db
from routes.config import SCOPES
from routes.config import google_creds
from algoliasearch.search.client import SearchClientSync
from routes.config import ALGOLIA_APP_ID, ALGOLIA_API_KEY,ALGOLIA_INDEX_NAME,SHEET4
job_bp=Blueprint('job',__name__)


# create the sync client
algolia_client = SearchClientSync(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
from flask import render_template, request, redirect, url_for, flash

@job_bp.route('/post_job', methods=['POST', 'GET'])
def post_job():
    if request.method == 'POST':
        # Extract form data
        hr_name = request.form.get('hr_name')
        job_id = request.form.get('job_id')
        title = request.form.get('job_title')
        experience = request.form.get('experience_required')
        location = request.form.get('job_location')
        required_skills_raw = request.form.get('required_skills')
        description = request.form.get('job_description')

        # Validate required fields
        if not hr_name or not job_id or not title or not experience or not location or not required_skills_raw or not description:
            flash('Please fill in all required fields.', 'danger')
            return redirect(url_for('job_bp.post_job'))

        # Process skill strings into a list
        required_skills_list = [s.strip() for s in required_skills_raw.split(',') if s.strip()]

        # Prepare job data for Firestore and Algolia
        job_data = {
            'hr_name': hr_name,
            'job_id': job_id,
            'job_title': title,
            'experience_required': experience,
            'job_location': location,
            'required_skills': required_skills_list,
            'job_description': description
        }

        try:
            # Save to Firestore
            _, doc_ref = db.collection('jobs').add(job_data)
            object_id = doc_ref.id

            # Save to Algolia
            record = {**job_data, 'objectID': object_id}
            save_resp = algolia_client.save_object(index_name=ALGOLIA_INDEX_NAME, body=record)
            algolia_client.wait_for_task(index_name=ALGOLIA_INDEX_NAME, task_id=save_resp.task_id)

            # Add headers once if the sheet is empty
            if not SHEET4.get_all_values():
                SHEET4.insert_row([
                    'hr_name', 'job_id', 'job_title', 'experience_required', 'job_location',
                    'required_skills', 'job_description'
                ], 1)

            # Save job data to Google Sheet
            SHEET4.append_row([
                hr_name,
                job_id,
                title,
                experience,
                location,
                ', '.join(required_skills_list),
                description
            ])

            flash('Job posted successfully!', 'success')
            return redirect(url_for('auth.login'))

        except Exception as e:
            print(f'Error occurred: {str(e)}', 'danger')
            return redirect(url_for('job.post_job'))

    return render_template('coop_hr.html')





@job_bp.route('/results')
def results():
    query = request.args.get('query', '')
    

    # 1) Perform the search (multi-query format, but you only have one request)
    res = algolia_client.search({
        "requests": [
            {"indexName": ALGOLIA_INDEX_NAME, "query": query}
        ]
    })

    # 2) Convert the response into a JSON string, then load into a dict
    raw_json = res.to_json()
    data = json.loads(raw_json)

    # 3) Drill into the JSON structure
    hits = []
    if "results" in data and len(data["results"]) > 0:
        hits = data["results"][0].get("hits", [])

    # 4) Pass these hits to your template
    return render_template('coop_hr1.html', jobs=hits)

@job_bp.route('/api/search')
def api_search():
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify([])

    # Ask Algolia for up to 5 hits based on the query
    res = algolia_client.search({
        "requests": [
            {"indexName": ALGOLIA_INDEX_NAME, "query": q, "hitsPerPage": 5}
        ]
    })
    data = json.loads(res.to_json())
    hits = data.get("results", [{}])[0].get("hits", [])

    # Return only the fields needed
    suggestions = [{"title": h["title"], "id": h["objectID"], "skills": h.get("skills", "")} for h in hits]
    return jsonify(suggestions)