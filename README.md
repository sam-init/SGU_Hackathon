
# 👷 SabKoKaam - Making Jobs Happen for Everyone!

SabKoKaam is a simple, smart web app that helps companies post jobs easily and makes sure those jobs reach the right people. It’s built with Flask and powered by some cool tools like Google Cloud APIs and Algolia to make things fast, accessible, and smooth.

---

## ✨ What SabKoKaam Does

- ✅ Lets HRs or companies post job openings with all the important details
- 🌐 Automatically translates job descriptions (perfect for reaching more people!)
- 🔊 Can read job details out loud using Text-to-Speech (accessibility matters)
- 🔍 Job listings are searchable instantly thanks to Algolia
- 🧾 Stores a copy of job data in Google Sheets for tracking or backups

---

## 🛠️ Tech Behind the Scenes

| Tool | What it’s for |
|------|---------------|
| **Flask** | Web framework (Python) |
| **Firestore** | Stores job listings securely |
| **Google Translate API** | Translates job descriptions |
| **Text-to-Speech API** | Converts job text to audio |
| **Algolia** | Super fast search |
| **Google Sheets API** | Backup and logging |
| **Bootstrap** | Clean and responsive UI |

---

## 🗂️ Project Structure

```
sabkokaam/
├── app.py
├── routes/
│   ├── auth.py
│   ├── job.py
│   └── tts.py
├── templates/
│   ├── coop_hr.html
│   └── login.html
├── static/
├── config.py
├── requirements.txt
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone this repo

```bash
git clone https://github.com/yourusername/sabkokaam.git
cd sabkokaam
```

### 2. Create a virtual environment and activate it

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install the dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up your credentials

- Add your Google Cloud service account JSON file
- Configure your `config.py` or `.env` with:
  - `GOOGLE_APPLICATION_CREDENTIALS`
  - Your Algolia App ID & API Key
  - Google Sheet ID (for logging)

### 5. Run the app

```bash
flask run
```

Visit [http://localhost:5000](http://localhost:5000) in your browser.

---

## 📦 APIs Used

- **Google Cloud Translation** – for multilingual job support  
- **Google Cloud Text-to-Speech** – for audio job descriptions  
- **Algolia Search** – for lightning-fast search  
- **gspread** – to write job posts into Google Sheets  

---

## 📝 To-Do List

- [ ] Add user login and role-based dashboards
- [ ] Track job applications
- [ ] Add support for job approvals/moderation


