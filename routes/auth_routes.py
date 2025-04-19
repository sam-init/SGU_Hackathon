from flask import Blueprint, request, render_template, redirect, url_for,flash,jsonify,session
from firebase_admin import auth,firestore
import requests
from oauth2client.service_account import ServiceAccountCredentials
from googleapiclient.discovery import build
from routes.config import FIREBASE_WEB_API_KEY,db,SCOPES,google_creds,SHEET1,SHEET3,FOLDER_ID,drive_service
from werkzeug.utils import secure_filename
import os, uuid,io
from googleapiclient.http import MediaIoBaseUpload

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

    return render_template('lb_login.html')


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

            # Extracting form data
            full_name = request.form.get('fullName')
            email = request.form.get('email')
            password = request.form.get('password')
            confirm_password = request.form.get('confirmPassword')
            dob = request.form.get('dob')
            contact_number = request.form.get('contactNumber')
            aadhar = request.form.get('aadhar')
            address = request.form.get('address')
            country = request.form.get('country')
            state = request.form.get('state')
            district = request.form.get('district')
            role = request.form.get('role')

            print(f"📧 User: {email}, Role: {role}")

            if password != confirm_password:
                flash("Passwords do not match!", "error")
                return render_template('Cemployee_signin.html')

            # Create Firebase user
            user = auth.create_user(email=email, password=password, display_name=full_name)
            print("🔥 Firebase user created")

            # Data to be stored
            user_data = {
                'fullName': full_name,
                'email': email,
                'dob': dob,
                'contactNumber': contact_number,
                'aadhar': aadhar,
                'address': address,
                'country': country,
                'state': state,
                'district': district,
                'role': role
            }

            # Save to Firestore
            collection = 'Cemployers' if role == 'Employer' else 'Cemployees'
            db.collection(collection).document(user.uid).set(user_data)
            print(f"📦 Data stored in Firestore -> {collection}")

            # Save to Google Sheet (optional)
            values = SHEET1.get_all_values()
            if not values or not values[0]:
                SHEET1.insert_row([
                    "Full Name", "Email", "DOB", "Contact Number", "Aadhar", "Address", "Country", "State", "District", "Role"
                ], index=1)
                print("📝 Headers added to Sheet")

            SHEET1.append_row([
                full_name, email, dob, contact_number, aadhar, address, country, state, district, role
            ])
            print("✅ Data appended to Google Sheet")

            flash("Form submitted and user registered successfully!", "success")
            
            # Redirect based on role
            if role == 'Employer':
                return redirect(url_for('auth.login'))
            else:
                return redirect(url_for('auth.employee_info'))

        except Exception as e:
            print("❌ Exception caught:", e)
            flash(f"Error while processing the form: {str(e)}", "error")

    return render_template('Cemployee_signin.html')



@auth_bp.route('/employee-info', methods=['GET', 'POST'])
def employee_info():
    if request.method == 'POST':
        try:
            print("📥 Form POST received")

            # Get form data
            full_name = request.form.get('fullName')
            contact_number = request.form.get('contactNumber')
            email = request.form.get('email')
            skills = request.form.get('skills')
            additional_info = request.form.get('additionalInfo')

             # ✅ Check if email exists in Firestore
            users_ref = db.collection('Cemployees')
            query = users_ref.where('email', '==', email).limit(1).get()

            if not query:
                flash("Email not registered. Please sign up first.", "error")
                return redirect(url_for('auth.employee_info'))

            user_data = query[0].to_dict()
            print("✅ Email authenticated:", user_data['email'])

            # ✅ Handle Resume Upload
            resume = request.files.get('resumeUpload')
            file_metadata = {
                 'name': f"{uuid.uuid4()}_{resume.filename}",
                 'parents': [FOLDER_ID]  # Specify the folder ID where you want the photo uploaded
             }
            media = MediaIoBaseUpload(io.BytesIO(resume.read()), mimetype=resume.mimetype)
            drive_file = drive_service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink').execute()
            resume_url = drive_file.get('webViewLink')  # Photo link in Google Drive

            # ✅ Append to Google Sheet
            header_row = SHEET3.row_values(1)
            if not header_row or "Full Name" not in header_row:
                SHEET3.insert_row(["Full Name", "Email", "Contact", "Skills", "Additional Info", "Resume URL"], 1)
            SHEET3.append_row([full_name, email, contact_number, skills, additional_info, resume_url])
            print("📊 Data appended to Google Sheet")

            flash("Form submitted successfully! Resume uploaded.", "success")
            return redirect(url_for('auth.employee_info'))

        except Exception as e:
            print("❌ Error:", str(e))
            flash(f"Error: {str(e)}", "error")
            return redirect(url_for('auth.employee_info'))

    return render_template('Cemployee_followup.html')





