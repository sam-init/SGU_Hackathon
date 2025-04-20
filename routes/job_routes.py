from flask import Flask, request, render_template, redirect, url_for,jsonify,Blueprint
import json
import gspread
from routes.config import db
from routes.config import SCOPES
from routes.config import google_creds
from algoliasearch.search.client import SearchClientSync
from routes.config import ALGOLIA_APP_ID, ALGOLIA_API_KEY,ALGOLIA_INDEX_NAME,SHEET2
job_bp=Blueprint('job',__name__)


# create the sync client
algolia_client = SearchClientSync(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
from flask import render_template, request, redirect, url_for, flash

@job_bp.route('/post_job', methods=['POST', 'GET'])
def post_job():
    if request.method == 'POST':
        # Extract form data
        title = request.form.get('job_title')
        job_type = request.form.get('job_type')
        department = request.form.get('department')
        experience = request.form.get('experience_required')
        location = request.form.get('job_location')
        deadline = request.form.get('application_deadline')
        required_skills_raw = request.form.get('required_skills')
        preferred_skills_raw = request.form.get('preferred_skills')
        education = request.form.get('education')
        salary = request.form.get('salary_range')
        description = request.form.get('job_description')
        benefits = request.form.get('benefits')

        # Validate required fields
        if not title or not job_type or not experience or not location or not required_skills_raw or not description:
            flash('Please fill in all required fields.', 'danger')
            return redirect(url_for('job_bp.post_job'))

        # Process skill strings into lists
        required_skills_list = [s.strip() for s in required_skills_raw.split(',') if s.strip()]
        preferred_skills_list = [s.strip() for s in preferred_skills_raw.split(',')] if preferred_skills_raw else []

        # Prepare job data for Firestore and Algolia
        job_data = {
            'job_title': title,
            'job_type': job_type,
            'department': department,
            'experience_required': experience,
            'job_location': location,
            'application_deadline': deadline,
            'required_skills': required_skills_list,
            'preferred_skills': preferred_skills_list,
            'education': education,
            'salary_range': salary,
            'job_description': description,
            'benefits': benefits
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
            if not SHEET2.get_all_values():
                SHEET2.insert_row([
                    'job_title', 'job_type', 'department', 'experience_required', 'job_location', 'application_deadline',
                    'required_skills', 'preferred_skills', 'education', 'salary_range', 'job_description', 'benefits'
                ], 1)

            # Save job data
            SHEET2.append_row([
                title,
                job_type,
                department,
                experience,
                location,
                deadline,
                ', '.join(required_skills_list),
                ', '.join(preferred_skills_list),
                education,
                salary,
                description,
                benefits
            ])

            flash('Job posted successfully!', 'success')
            return redirect(url_for('auth.login'))

        except Exception as e:
            flash(f'Error occurred: {str(e)}', 'danger')
            return redirect(url_for('job_bp.post_job'))

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