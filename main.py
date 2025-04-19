from flask import Flask,redirect,url_for
from routes.auth_routes  import auth_bp 
from routes.job_routes  import job_bp  
from routes.tts_routes  import tts_bp  
from routes.config  import config_bp  
import os


# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.urandom(24)  


# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(job_bp, url_prefix='/job')
app.register_blueprint(tts_bp, url_prefix='/tts')
app.register_blueprint(config_bp, url_prefix='/config')

# Default route
@app.route('/')
def index():
    return redirect(url_for('auth.register'))

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
