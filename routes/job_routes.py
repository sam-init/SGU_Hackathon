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
        # Get data from the form
        title = request.form.get('title')
        company = request.form.get('company')
        location = request.form.get('location')
        job_type = request.form.get('job_type')
        salary = request.form.get('salary')
        raw_skills = request.form.get('skills')
        description = request.form.get('description')
        requirements = request.form.get('requirements')

        # Form validation
        if not title or not company or not location or not job_type or not raw_skills or not description:
            flash('Please fill in all required fields.', 'danger')
            return redirect(url_for('job_bp.post_job'))  # Stay on the same page if validation fails

        # Process skills (split by commas)
        skills_list = [s.strip().lower() for s in raw_skills.split(',') if s.strip()]

        # Prepare job data
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

        try:
            # 1) Save to Firestore
            _, doc_ref = db.collection('jobs').add(job)
            object_id = doc_ref.id

            # 2) Save to Algolia
            record = {**job, 'objectID': object_id}
            save_resp = algolia_client.save_object(index_name=ALGOLIA_INDEX_NAME, body=record)
            algolia_client.wait_for_task(index_name=ALGOLIA_INDEX_NAME, task_id=save_resp.task_id)

            # 3) Append to Google Sheets
            SHEET2.append_row([
                title, company, location, job_type,
                salary, ', '.join(skills_list), description, requirements
            ])

            flash('Job posted successfully!', 'success')
            return redirect(url_for('auth.login'))  # Redirect to prevent form resubmission

        except Exception as e:
            flash(f'Error occurred: {str(e)}', 'danger')
            return redirect(url_for('job_bp.post_job'))

    # If the request is GET, render the form
    return render_template('Employer.html')



@job_bp.route('/results')
def results():
    query = request.args.get('query', '')
    if not query:
        return render_template('results.html', jobs=[])

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
    return render_template('results.html', jobs=hits)

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