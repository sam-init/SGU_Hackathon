from flask import Flask,Blueprint, request, render_template, redirect, url_for,flash,jsonify,session
from firebase_admin import auth,firestore
import requests
from google.oauth2 import service_account
from googleapiclient.discovery import build
from routes.config import FIREBASE_WEB_API_KEY,db,SCOPES,google_creds,SHEET1,FOLDER_ID

import gspread
auth_bp=Blueprint('auth',__name__)





@auth_bp.route('/signup', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Collect form data
        name = request.form['fullname']
        role = request.form['role'] 
        email = request.form['email']
        password = request.form['confirm-password']
        dob = request.form['dob']
        phone = request.form['contact']
        phone_alt = request.form['alternate-contact']
        aadhaar = request.form['aadhar'] 
        country = request.form['country'] 
        state = request.form['state'] 
        city = request.form['city'] 
        
        # Optional: Handle photo upload if required (commented out)
        # photo_file = request.files['photo']

        try:
            # ✅ Create Firebase user with email/password authentication
            user = auth.create_user(email=email, password=password, display_name=name)

            # ✅ Insert user data into Firestore (Cloud Firestore Database)
            user_data = {
                "name": name,
                "role": role,
                "email": email,
                "aadhaar": aadhaar,
                "dob": dob,
                "phone": phone,
                "phone_alt": phone_alt,
                "country": country,
                "state": state,
                "city": city,
                "uid": user.uid,  # Firebase UID for the user
                "created_at": firestore.SERVER_TIMESTAMP  # Timestamp for when user was created
            }

            # Add user data to Firestore (create a new document for the user)
            user_ref = db.collection('users').document(user.uid)  # Use UID as document ID
            user_ref.set(user_data)

            # ✅ Optionally upload photo to Google Drive (if required) (commented out)
            # file_metadata = {
            #     'name': f"{uuid.uuid4()}_{photo_file.filename}",
            #     'parents': [FOLDER_ID]  # Specify the folder ID where you want the photo uploaded
            # }
            # media = MediaIoBaseUpload(io.BytesIO(photo_file.read()), mimetype=photo_file.mimetype)
            # drive_file = drive_service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink').execute()
            # photo_link = drive_file.get('webViewLink')  # Photo link in Google Drive

            # Optionally, add photo link to Firestore (if required)
            # user_ref.update({"photo_link": photo_link})

            # ✅ Optionally, append the same data to Google Sheets
            '''values = SHEET.get_all_values()
            if not values or not values[0]:  # Sheet is empty or first row is blank
                headers = [
                    "Full Name", "Role", "Email", "Aadhaar", "DOB", "Phone", "Alternate Phone",
                    "Country", "State", "City"
                ]
                SHEET.insert_row(headers, index=1)

            # Append user data to Google Sheets
            SHEET.append_row([name, role, email, aadhaar, dob, phone, phone_alt, country, state, city])'''

            # Redirect to login page after successful registration
            flash("Account created successfully! Please log in.", "success")
            return redirect(url_for('auth.login'))

        except Exception as e:
            # Handle any errors that occur during Firebase user creation or data insertion
            flash(f"Error during registration: {e}", "error")
            return render_template('sign-in.html')

    return render_template('sign-in.html')



@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        print(f"Email: {email}, Password: {password}")  # Debugging line

        try:
            # ✅ Firebase REST API for email/password authentication
            payload = {
                'email': email,
                'password': password,
                'returnSecureToken': True
            }
            resp = requests.post(
                f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}",
                json=payload
            )

            if resp.status_code != 200:
                error_message = resp.json().get('error', {}).get('message', 'Invalid email or password')
                flash(f"Login error: {error_message}", 'error')
                return render_template('login.html')

            # ✅ Firebase Authentication successful, now fetch the user data from Firestore
            user_data = resp.json()  # Get the user data from the response
            uid = user_data.get('localId')  # UID of the authenticated user

            # Retrieve the user's role from Firestore
            db = firestore.client()
            user_ref = db.collection('users').document(uid)
            user_doc = user_ref.get()

            if not user_doc.exists:
                flash("No user data found in Firestore.", 'error')
                return render_template('login.html')

            user_data = user_doc.to_dict()
            role = user_data.get('role')

            if role == 'Employee': 
                return render_template('Cemployee_sign-in.html')
            elif role == 'Employer':
                return redirect(url_for('job.post_job'))
            else:
                flash("No valid role assigned.", 'warning')
                return render_template('login.html')

        except Exception as e:
            flash(f"Login error: {str(e)}", 'error')

    return render_template('login.html')


@auth_bp.route('/category-selection', methods=['GET', 'POST'])
def category_selection():
    if request.method == 'POST':
        selected_categories = request.form.getlist('category')  # Get the selected categories

        # Get the UID from the session (assuming the user is logged in)
        uid = session.get('uid')  # Or use `request.form.get('uid')` if passed via form

        # If categories are selected, save them in Firestore
        if selected_categories:
            try:
                db = firestore.client()
                user_ref = db.collection('users').document(uid)
                user_ref.update({"categories": selected_categories})  # Update categories in Firestore

                # Redirect based on role or any other logic
                return redirect(url_for('auth.dashboard'))  # Example: Redirect to the dashboard or home page

            except Exception as e:
                flash(f"Error updating categories: {str(e)}", "error")
                return render_template('category_selection.html')

        flash("Please select at least one category.", "warning")
    
    return render_template('category_selection.html')


@auth_bp.route('/employer-form', methods=['GET', 'POST'])
def employer_form():
    if request.method == 'POST':
        try:
            print("👉 Received POST request")
            name = request.form['name']
            email = request.form['email']
            password = request.form['password']
            print(f"📧 Got user: {email}")

            country = request.form['country']
            state = request.form['state']
            district = request.form['district']
            phone = request.form['phone']
            role = request.form['role']
            company = request.form['company']
            job_title = request.form['job_title']

            print("✅ All form fields retrieved")

            # Create Firebase user
            user = auth.create_user(email=email, password=password, display_name=name)
            print("🔥 Firebase user created")

            # Google Sheet Header Setup
            values = SHEET1.get_all_values()
            if not values or not values[0]:
                SHEET1.insert_row([
                    "Name", "Email", "Country", "State", "District", "Phone", "Role", "Company", "Job Title"
                ], index=1)
                print("📝 Headers added to Sheet")

            # Append to Sheet
            SHEET1.append_row([
                name, email, country, state, district, phone, role, company, job_title,
            ])
            print("✅ Data appended to Google Sheet")

            flash("Form submitted and user registered successfully!", "success")
            return render_template('Cemployee_followup.html')

        except Exception as e:
            print("❌ Exception caught:", e)
            flash(f"Error while processing the form: {str(e)}", "error")

    return render_template('Cemployee_signin.html')



